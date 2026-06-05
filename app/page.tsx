import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Hero, SpecialDish, FreshVeg, PopularMenu, Testimonials,
} from "@/components/landing";
import { fetchMenu } from "@/lib/fetch-menu";

// Short ISR: served from cache (instant), regenerated in the background every
// 10s so the popular-menu teaser picks up sheet edits without blocking.
export const revalidate = 10;

export default async function Home() {
  const menu = await fetchMenu();
  // Sections are sheet-driven: flag dishes with "yes" in the special / popular
  // columns. Max 3 each; when none are flagged the component hides the section.
  const special = menu.filter((m) => m.special).slice(0, 3);
  const popular = menu.filter((m) => m.popular).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SpecialDish items={special} />
        <FreshVeg />
        <PopularMenu items={popular} />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
