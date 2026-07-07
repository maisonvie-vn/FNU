// Dữ liệu thư viện ảnh — mỗi "album" là 1 lớp/chủ đề, có ảnh bìa + nhiều ảnh bên trong.
// Ảnh hiện dùng placeholder (picsum). Thay bằng ảnh thật: đổi `cover` và mảng `photos`,
// hoặc bỏ ảnh vào public/gallery/... rồi trỏ src "/gallery/....jpg".

export type Album = {
  id: string;
  titleEn: string;
  titleVi: string;
  cover: string;
  photos: string[];
};

// Sinh 12 ảnh placeholder cho mỗi album (đổi bằng ảnh thật khi có)
function photos(id: string, n = 12): string[] {
  return Array.from(
    { length: n },
    (_, i) => `https://picsum.photos/seed/fca-${id}-${i + 1}/1200/800`,
  );
}

export const ALBUMS: Album[] = [
  { id: "french", titleEn: "French Cuisine", titleVi: "Ẩm thực Pháp", cover: "https://picsum.photos/seed/fca-french-cover/900/700", photos: photos("french") },
  { id: "vietnam", titleEn: "Vietnamese Cuisine", titleVi: "Ẩm thực Việt Nam", cover: "https://picsum.photos/seed/fca-vietnam-cover/900/700", photos: photos("vietnam") },
  { id: "italian", titleEn: "Italian Cuisine", titleVi: "Ẩm thực Ý", cover: "https://picsum.photos/seed/fca-italian-cover/900/700", photos: photos("italian") },
  { id: "plating", titleEn: "Plating Studio", titleVi: "Studio trình bày", cover: "https://picsum.photos/seed/fca-plating-cover/900/700", photos: photos("plating") },
  { id: "service", titleEn: "Fine-dining Service", titleVi: "Phục vụ fine-dining", cover: "https://picsum.photos/seed/fca-service-cover/900/700", photos: photos("service") },
  { id: "photography", titleEn: "Food Photography", titleVi: "Nhiếp ảnh ẩm thực", cover: "https://picsum.photos/seed/fca-photography-cover/900/700", photos: photos("photography") },
  { id: "fermentation", titleEn: "Fermentation Lab", titleVi: "Lab lên men", cover: "https://picsum.photos/seed/fca-fermentation-cover/900/700", photos: photos("fermentation") },
  { id: "graduation", titleEn: "Graduation Showcase", titleVi: "Trình diễn tốt nghiệp", cover: "https://picsum.photos/seed/fca-graduation-cover/900/700", photos: photos("graduation") },
];
