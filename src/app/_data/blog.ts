// Dữ liệu blog — mỗi bài có đủ trường SEO theo chuẩn Yoast:
// focusKeyword, seoTitle (≤60 ký tự), metaDescription (≤155 ký tự), slug, ảnh + alt.
// Nội dung song ngữ: mỗi block có tiếng Việt (chính) + tiếng Anh (phụ).

export type Block = { type: "h2" | "p"; vi: string; en: string };

export type Post = {
  slug: string;
  date: string; // ISO
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  cover: string;
  coverAlt: string;
  readMins: number;
  content: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "vi-sao-nen-hoc-food-culture-aesthetic-2026",
    date: "2026-06-15",
    focusKeyword: "học food culture",
    seoTitle: "Vì sao nên học Food Culture & Aesthetic 2026",
    metaDescription:
      "Học food culture giúp bạn đọc văn hóa qua ẩm thực và thiết kế trải nghiệm bàn ăn. Khám phá lý do nên chọn học phần Food Culture & Aesthetic năm 2026.",
    titleVi: "Vì sao nên học Food Culture & Aesthetic năm 2026?",
    titleEn: "Why study Food Culture & Aesthetic in 2026?",
    excerptVi: "Học food culture không chỉ là nấu ăn — mà là đọc văn hóa, lịch sử và thẩm mỹ ẩn sau mỗi món ăn.",
    excerptEn: "Studying food culture is more than cooking — it is reading the culture, history and aesthetics behind every dish.",
    cover: "https://picsum.photos/seed/fca-blog-1/1200/675",
    coverAlt: "Bàn ăn fine-dining được bày trí tinh tế — học food culture",
    readMins: 5,
    content: [
      { type: "p", vi: "Học food culture đang trở thành lựa chọn của nhiều bạn trẻ yêu ẩm thực và ngành F&B. Đây không chỉ là kỹ năng nấu nướng, mà là cách đọc văn hóa, lịch sử và thẩm mỹ ẩn sau mỗi món ăn.", en: "Studying food culture is becoming a popular choice for young people who love gastronomy and the F&B industry. It is not just about cooking, but about reading the culture, history and aesthetics behind every dish." },
      { type: "h2", vi: "Ẩm thực là một ngôn ngữ văn hóa", en: "Food is a cultural language" },
      { type: "p", vi: "Mỗi nền ẩm thực kể một câu chuyện về vùng đất, con người và niềm tin. Khi học food culture, bạn học cách giải mã câu chuyện đó — từ nguyên liệu, cách bày biện đến nghi thức bàn ăn.", en: "Every cuisine tells a story of land, people and belief. Studying food culture teaches you to decode that story — from ingredients and plating to dining rituals." },
      { type: "h2", vi: "Sẵn sàng cho ngành F&B 2026", en: "Ready for the 2026 F&B industry" },
      { type: "p", vi: "Học phần Food Culture & Aesthetic trang bị tư duy hiện đại: AI trong thiết kế dịch vụ, hành vi ăn uống của Gen Z và tính bền vững như một tay nghề — những điều nhà tuyển dụng F&B 2026 đang tìm kiếm.", en: "The Food Culture & Aesthetic course equips you with modern thinking: AI in service design, Gen Z dining behaviour, and sustainability as craft — exactly what 2026 F&B employers are looking for." },
    ],
  },
  {
    slug: "fine-dining-la-gi-vi-sao-gen-z-quan-tam",
    date: "2026-06-28",
    focusKeyword: "fine dining là gì",
    seoTitle: "Fine dining là gì? Vì sao Gen Z quan tâm",
    metaDescription:
      "Fine dining là gì và tại sao thế hệ Gen Z ngày càng yêu thích? Tìm hiểu trải nghiệm ẩm thực cao cấp và cách thiết kế nó trong bài viết này.",
    titleVi: "Fine dining là gì và vì sao Gen Z quan tâm?",
    titleEn: "What is fine dining, and why does Gen Z care?",
    excerptVi: "Fine dining không chỉ là bữa ăn đắt tiền — đó là một trải nghiệm được thiết kế tỉ mỉ từ đĩa ăn đến không gian.",
    excerptEn: "Fine dining is not just an expensive meal — it is a carefully designed experience, from the plate to the room.",
    cover: "https://picsum.photos/seed/fca-blog-2/1200/675",
    coverAlt: "Không gian nhà hàng fine-dining sang trọng",
    readMins: 6,
    content: [
      { type: "p", vi: "Fine dining là gì? Đó là hình thức ẩm thực cao cấp, nơi mỗi chi tiết — món ăn, cách phục vụ, ánh sáng, âm thanh — đều được thiết kế để tạo nên một trải nghiệm trọn vẹn.", en: "What is fine dining? It is a form of high-end gastronomy where every detail — the food, the service, the lighting, the sound — is designed to create a complete experience." },
      { type: "h2", vi: "Vì sao Gen Z yêu thích fine dining", en: "Why Gen Z loves fine dining" },
      { type: "p", vi: "Gen Z tìm kiếm trải nghiệm đáng chia sẻ và có ý nghĩa. Fine dining đáp ứng cả hai: câu chuyện văn hóa phía sau món ăn và tính thẩm mỹ để lưu giữ khoảnh khắc.", en: "Gen Z seeks experiences that are shareable and meaningful. Fine dining delivers both: the cultural story behind the food and the aesthetics worth capturing." },
      { type: "h2", vi: "Học cách thiết kế trải nghiệm fine dining", en: "Learn to design the fine-dining experience" },
      { type: "p", vi: "Tại Food Culture & Aesthetic, sinh viên thực hành thiết kế trải nghiệm bàn ăn — từ bố cục đĩa, trình tự cảm giác đến không gian phục vụ — với đồ án tốt nghiệp là một concept fine dining hoàn chỉnh.", en: "At Food Culture & Aesthetic, students practise designing dining experiences — from plate composition and sensory sequencing to service space — culminating in a complete fine-dining concept as their capstone." },
    ],
  },
  {
    slug: "5-xu-huong-fb-2026-sinh-vien-am-thuc-nen-biet",
    date: "2026-07-05",
    focusKeyword: "xu hướng F&B 2026",
    seoTitle: "5 xu hướng F&B 2026 sinh viên ẩm thực nên biết",
    metaDescription:
      "Cập nhật 5 xu hướng F&B 2026 quan trọng: AI, bền vững, Gen Z, ẩm thực bản địa và trải nghiệm. Kiến thức cần thiết cho sinh viên ngành ẩm thực.",
    titleVi: "5 xu hướng F&B 2026 mọi sinh viên ẩm thực nên biết",
    titleEn: "5 F&B trends of 2026 every culinary student should know",
    excerptVi: "Từ AI đến bền vững, đây là những xu hướng F&B 2026 đang định hình lại ngành ẩm thực.",
    excerptEn: "From AI to sustainability, these are the 2026 F&B trends reshaping the culinary industry.",
    cover: "https://picsum.photos/seed/fca-blog-3/1200/675",
    coverAlt: "Món ăn hiện đại thể hiện xu hướng F&B 2026",
    readMins: 7,
    content: [
      { type: "p", vi: "Nắm bắt xu hướng F&B 2026 giúp sinh viên ẩm thực đi trước một bước. Dưới đây là năm xu hướng đang định hình lại cách chúng ta ăn và thiết kế trải nghiệm ẩm thực.", en: "Grasping the 2026 F&B trends helps culinary students stay one step ahead. Here are five trends reshaping how we eat and design dining experiences." },
      { type: "h2", vi: "1. AI trong thiết kế dịch vụ", en: "1. AI in service design" },
      { type: "p", vi: "AI hỗ trợ dự báo, cá nhân hóa và tối ưu quy trình phục vụ — nhưng con người vẫn giữ vai trò kể chuyện và tạo cảm xúc.", en: "AI supports forecasting, personalisation and service optimisation — yet humans remain the storytellers who create emotion." },
      { type: "h2", vi: "2. Bền vững như một tay nghề", en: "2. Sustainability as craft" },
      { type: "p", vi: "Lên men, nấu trọn nguyên liệu và nguồn cung minh bạch trở thành kỹ năng cốt lõi, không còn là điểm cộng.", en: "Fermentation, whole-ingredient cooking and transparent sourcing become core skills, no longer just a bonus." },
      { type: "h2", vi: "3. Ẩm thực bản địa lên ngôi", en: "3. The rise of local cuisines" },
      { type: "p", vi: "Từ phở đến các món đường phố, ẩm thực bản địa Việt Nam ngày càng được thế giới công nhận và đưa lên bản đồ fine dining.", en: "From phở to street food, Vietnam's local cuisine is increasingly recognised worldwide and placed on the fine-dining map." },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
