import { HeaderBar } from "./_components/HeaderBar/HeaderBar";

export default function MyShelfPage() {
  return (
    <>
      <HeaderBar />
      <main className="flex flex-1 flex-col gap-4 p-6">
        <h1 className="text-lg font-semibold">My shelf</h1>
        <p>Hello World (Authenticated)</p>
      </main>
    </>
  );
}
