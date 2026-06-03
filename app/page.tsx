import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Hero, SpecialDish, FreshVeg, PopularMenu, Testimonials,
} from "@/components/landing";
import { fetchMenu } from "@/lib/fetch-menu";

// ISR: served static (instant), regenerated in the background every 60s so the
// popular-menu teaser picks up sheet edits without per-request fetching.
export const revalidate = 60;

export default async function Home() {
  const menu = await fetchMenu();
  const popular = menu.slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SpecialDish />
        <FreshVeg />
        <PopularMenu items={popular} />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
