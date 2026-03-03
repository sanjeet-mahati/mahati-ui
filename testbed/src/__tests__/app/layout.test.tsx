// src/__tests__/app/layout.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// ✅ Polyfills required by react-dom/server in some Jest/JSDOM environments
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

/**
 * ✅ React server renderer + JSDOM needs:
 * - setImmediate / clearImmediate
 * - Web Streams (ReadableStream, TransformStream, etc.)
 *
 * Must be defined BEFORE requiring react-dom/server.
 */
(() => {
  // ---- setImmediate polyfill (JSDOM doesn't have it) ----
  if (!(globalThis as any).setImmediate) {
    (globalThis as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) =>
      setTimeout(fn, 0, ...args);
  }
  if (!(globalThis as any).clearImmediate) {
    (globalThis as any).clearImmediate = (id: any) => clearTimeout(id);
  }

  // ---- Web Streams polyfill (for renderToReadableStream) ----
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webStreams = require("stream/web");

    if (!(globalThis as any).ReadableStream && webStreams?.ReadableStream) {
      (globalThis as any).ReadableStream = webStreams.ReadableStream;
    }
    if (!(globalThis as any).TransformStream && webStreams?.TransformStream) {
      (globalThis as any).TransformStream = webStreams.TransformStream;
    }
    if (!(globalThis as any).WritableStream && webStreams?.WritableStream) {
      (globalThis as any).WritableStream = webStreams.WritableStream;
    }
    if (
      !(globalThis as any).ReadableStreamDefaultReader &&
      webStreams?.ReadableStreamDefaultReader
    ) {
      (globalThis as any).ReadableStreamDefaultReader =
        webStreams.ReadableStreamDefaultReader;
    }
  } catch {
    // If stream/web isn't available, tests will fail later with a clearer error.
  }
})();

// IMPORTANT: require AFTER polyfills
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderToReadableStream } = require("react-dom/server");

// --------------------
// Mocks (framework + child deps only)
// RootLayout + its logic remain REAL and executed.
// --------------------

jest.mock("next/font/google", () => ({
  __esModule: true,
  Inter: () => ({ className: "mock-inter-class" }),
}));

// Control cookies().get(...) per test
const cookiesGetMock = jest.fn();

/**
 * ✅ Next.js 16.1.x: cookies() is async (returns a Promise).
 * So our mock MUST return a Promise that resolves to an object with get().
 */
jest.mock("next/headers", () => ({
  __esModule: true,
  cookies: () =>
    Promise.resolve({
      get: cookiesGetMock,
    }),
}));

/**
 * ✅ CRITICAL:
 * Jest in this repo cannot resolve "@/..." (no moduleNameMapper),
 * but layout.tsx imports those paths, so we MUST mock them as VIRTUAL modules.
 */

// Capture props passed to SideNav to verify computed initialExpanded
const sideNavMock = jest.fn(
  ({ initialExpanded }: { initialExpanded: boolean }) => (
    <nav data-testid="mock-sidenav">expanded:{String(initialExpanded)}</nav>
  )
);

jest.mock(
  "@/navigation/context-provider",
  () => {
    const React = require("react");
    return {
      __esModule: true,
      default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-context-provider">{children}</div>
      ),
    };
  },
  { virtual: true } as any
);

jest.mock(
  "@/navigation/sidebar/leftsidenavigation/sidenav",
  () => {
    return {
      __esModule: true,
      default: (props: any) => sideNavMock(props),
    };
  },
  { virtual: true } as any
);

// layout.tsx imports Header via relative path
jest.mock("../../navigation/header/header", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: () => <header data-testid="mock-header">Header</header>,
  };
});

// layout.tsx imports Footer, but (per your provided layout.tsx) it is NOT rendered.
// We still mock the module so the import is safe.
jest.mock("../../navigation/footer/footer", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: () => <footer data-testid="mock-footer">Footer</footer>,
  };
});

// --------------------
// Import the REAL RootLayout (NOT mocked)
// --------------------
import RootLayout from "../../app/layout";

// --------------------
// Helpers
// --------------------
const parseHtml = (html: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(`<!doctype html>${html}`, "text/html");
};

/**
 * ✅ Async server render helper (handles Suspense/async cookies())
 */
const renderElementToHtml = async (element: React.ReactElement) => {
  const stream = await renderToReadableStream(element);

  // Wait until all suspended content is ready
  if (stream.allReady) {
    await stream.allReady;
  }

  // Convert ReadableStream -> string
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let html = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value);
  }

  return html;
};

const renderLayoutToDoc = async (cookieValue?: string) => {
  sideNavMock.mockClear();
  cookiesGetMock.mockReset();

  // RootLayout does: cookies().get("sidebarExpanded")?.value
  cookiesGetMock.mockReturnValue(
    cookieValue === undefined ? undefined : { value: cookieValue }
  );

  const html = await renderElementToHtml(
    <RootLayout>
      <main data-testid="mock-children">Hello Children</main>
    </RootLayout>
  );

  return parseHtml(html);
};

describe("RootLayout (app/layout.tsx)", () => {
  it("renders <html lang='en'> and applies Inter() className on <body>", async () => {
    const doc = await renderLayoutToDoc(undefined);

    expect(doc.documentElement.tagName.toLowerCase()).toBe("html");
    expect(doc.documentElement.getAttribute("lang")).toBe("en");
    expect(doc.body.classList.contains("mock-inter-class")).toBe(true);
  });

  it("renders ContextProvider wrapper, Header, SideNav, and children", async () => {
    const doc = await renderLayoutToDoc(undefined);

    expect(
      doc.querySelector('[data-testid="mock-context-provider"]')
    ).not.toBeNull();
    expect(doc.querySelector('[data-testid="mock-header"]')).not.toBeNull();
    expect(doc.querySelector('[data-testid="mock-sidenav"]')).not.toBeNull();

    // ✅ DO NOT expect footer: layout.tsx (as provided) does not render it.
    expect(doc.querySelector('[data-testid="mock-footer"]')).toBeNull();

    expect(doc.querySelector('[data-testid="mock-children"]')).not.toBeNull();
    expect(doc.body.textContent || "").toContain("Hello Children");
  });

  it('computes initialExpanded=true when cookie "sidebarExpanded" is missing', async () => {
    const doc = await renderLayoutToDoc(undefined);

    const sidenav = doc.querySelector('[data-testid="mock-sidenav"]');
    expect(sidenav).not.toBeNull();
    expect(sidenav?.textContent || "").toContain("expanded:true");

    expect(sideNavMock).toHaveBeenCalledTimes(1);
    expect(sideNavMock.mock.calls[0][0]).toMatchObject({ initialExpanded: true });
  });

  it('computes initialExpanded=true when cookie "sidebarExpanded" is "1"', async () => {
    const doc = await renderLayoutToDoc("1");

    const sidenav = doc.querySelector('[data-testid="mock-sidenav"]');
    expect(sidenav).not.toBeNull();
    expect(sidenav?.textContent || "").toContain("expanded:true");

    expect(sideNavMock).toHaveBeenCalledTimes(1);
    expect(sideNavMock.mock.calls[0][0]).toMatchObject({ initialExpanded: true });
  });

  it('computes initialExpanded=false when cookie "sidebarExpanded" is "0"', async () => {
    const doc = await renderLayoutToDoc("0");

    const sidenav = doc.querySelector('[data-testid="mock-sidenav"]');
    expect(sidenav).not.toBeNull();
    expect(sidenav?.textContent || "").toContain("expanded:false");

    expect(sideNavMock).toHaveBeenCalledTimes(1);
    expect(sideNavMock.mock.calls[0][0]).toMatchObject({ initialExpanded: false });
  });

  it('calls cookies().get with key "sidebarExpanded"', async () => {
    await renderLayoutToDoc(undefined);
    expect(cookiesGetMock).toHaveBeenCalledWith("sidebarExpanded");
  });
});