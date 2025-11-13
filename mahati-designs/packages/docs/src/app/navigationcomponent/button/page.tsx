import Button from '@/components/Button';

export default function ButtonPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Button Component</h1>
      <div className="space-y-4">
        <Button color="#135f9b" size="medium">Primary Button</Button>
        <Button color="#e53e3e" size="medium" danger>Danger Button</Button>
        <Button color="#55b382" size="small" isLoading>Loading Button</Button>
      </div>
    </div>
  );
}