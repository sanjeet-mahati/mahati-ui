"use client";

import { useState } from "react";
import Image from "next/image";
import {MCard,MahatiModal} from "@/components";

export default function CardPage() {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isForMahatiModalOpen, setIsForMahatiModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [isScrollableModalOpen, setIsScrollableModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 p-12 max-w-4xl mx-auto">
        {/* Basic Modal Trigger */}
        <section 
          id="basic-modal"
          data-section-id="basic-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Basic Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsBasicModalOpen(true)}
            >
              Open Basic Modal
            </button>
          </MCard>
        </section>

        {/* Confirmation Modal Trigger */}
        <section 
          id="confirmation-modal"
          data-section-id="confirmation-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Confirmation Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsConfirmationModalOpen(true)}
            >
              Open Confirmation Modal
            </button>
          </MCard>
        </section>

        {/* Form Modal Trigger */}
        <section 
          id="form-modal"
          data-section-id="form-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Form Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsForMahatiModalOpen(true)}
            >
              Open Form Modal
            </button>
          </MCard>
        </section>

        {/* Image Modal Trigger */}
        <section 
          id="image-modal"
          data-section-id="image-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Image Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsImageModalOpen(true)}
            >
              Open Image Modal
            </button>
          </MCard>
        </section>

        {/* Notification Modal Trigger */}
        <section 
          id="notification-modal"
          data-section-id="notification-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Notification Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsNotificationModalOpen(true)}
            >
              Open Notification Modal
            </button>
          </MCard>
        </section>

        {/* Loading Modal Trigger */}
        <section 
          id="loading-modal"
          data-section-id="loading-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Loading Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsLoadingModalOpen(true)}
            >
              Open Loading Modal
            </button>
          </MCard>
        </section>

        {/* Full-Screen Modal Trigger */}
        <section 
          id="fullscreen-modal"
          data-section-id="fullscreen-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Full-Screen Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsFullScreenModalOpen(true)}
            >
              Open Full-Screen Modal
            </button>
          </MCard>
        </section>

        {/* Scrollable Modal Trigger */}
        <section 
          id="scrollable-modal"
          data-section-id="scrollable-modal"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Scrollable Modal</h2>
          <MCard className="max-w-sm">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsScrollableModalOpen(true)}
            >
              Open Scrollable Modal
            </button>
          </MCard>
        </section>

        {/* Modals */}
        <MahatiModal isOpen={isBasicModalOpen} onClose={() => setIsBasicModalOpen(false)} title="Basic Modal">
          <p>This is a basic modal with simple content.</p>
        </MahatiModal>

        <MahatiModal isOpen={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)} title="Confirmation Modal">
          <p>Are you sure you want to proceed?</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={() => alert('Confirmed!')}>
            Yes
          </button>
          <button className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => setIsConfirmationModalOpen(false)}>
            No
          </button>
        </MahatiModal>

        <MahatiModal isOpen={isForMahatiModalOpen} onClose={() => setIsForMahatiModalOpen(false)} title="Form Modal">
          <form>
            <label className="block mb-2">Name:</label>
            <input type="text" className="border rounded p-2 w-full mb-4" />
            <label className="block mb-2">Email:</label>
            <input type="email" className="border rounded p-2 w-full mb-4" />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => setIsForMahatiModalOpen(false)}>
              Submit
            </button>
          </form>
        </MahatiModal>

        <MahatiModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Image Modal">
          <Image src="/logo.png" alt="Company Logo" width={300} height={300} className="object-contain" />
        </MahatiModal>

        <MahatiModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} title="Notification Modal">
          <p>This is a notification message!</p>
        </MahatiModal>

        <MahatiModal isOpen={isLoadingModalOpen} onClose={() => setIsLoadingModalOpen(false)} title="Loading Modal">
          <p>Loading, please wait...</p>
          <div className="loader"></div> {/* You can add a spinner here */}
        </MahatiModal>

        <MahatiModal isOpen={isFullScreenModalOpen} onClose={() => setIsFullScreenModalOpen(false)} title="Full-Screen Modal">
          <div className="h-screen flex items-center justify-center">
            <h1 className="text-4xl">This is a full-screen modal!</h1>
          </div>
        </MahatiModal>

        <MahatiModal isOpen={isScrollableModalOpen} onClose={() => setIsScrollableModalOpen(false)} title="Scrollable Modal">
          <div className="max-h-60 overflow-y-auto">
            <p>Content goes here...</p>
            {/* Add more content to make it scrollable */}
            <p>Lorem ipsum dolor sit amet...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus auctor mattis. Praesent dictum in odio ac eget. Sed eu diam at nulla eleifend egestas. Mauris et ante quis lectus aliquet dictum. Phasellus et dolor. Maecenas et ante. Vestibulum sit amet metus. Curabitur eget sem eu velit eleifend elementum. Sed a nulla.</p>
            <p>Vivamus id enim. Sed eu diam at nulla eleifend egestas. Mauris et ante quis lectus aliquet dictum. Phasellus et dolor. Maecenas et ante. Vestibulum sit amet metus. Curabitur eget sem eu velit eleifend elementum. Sed a nulla. Vivamus id enim. Sed eu diam at nulla eleifend egestas. Mauris et ante quis lectus aliquet dictum. Phasellus et dolor. Maecenas et ante. Vestibulum sit amet metus. Curabitur eget sem eu velit eleifend elementum. Sed a nulla.</p>
            <p>Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui erat, auctor sed, placerat at, egestas sed, neque. Praesent in mauris eu fermentum.</p>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui erat, auctor sed, placerat at, egestas sed, neque. Praesent in mauris eu fermentum.</p>
            <p>Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, orci. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis.</p>
          </div>
        </MahatiModal>
      </main>
    </div>
  );
}