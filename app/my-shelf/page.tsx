import { FullscreenDropzone } from "./_components/FullscreenDropzone";
import { HeaderBar } from "./_components/HeaderBar/HeaderBar";
import { ShelfMasonryGrid } from "./_components/ShelfMasonryGrid";

export default function MyShelfPage() {
  return (
    <FullscreenDropzone>
      <HeaderBar />
      <main className="flex flex-1 flex-col p-6">
        <ShelfMasonryGrid />
      </main>
    </FullscreenDropzone>
  );
}
