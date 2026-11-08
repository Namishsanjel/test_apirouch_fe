import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Faq from "../components/Faq.jsx";
import Footer from "../components/Footer.jsx";
import { Eyebrow, ImgBlur, Words } from "../components/ui.jsx";
import { useReveal, stagger } from "../motion.js";
import { JOURNAL_PAGE } from "../data/pages.js";
import { PAGES } from "../data/content.js";

function PostCard({ post, titleW, index = null }) {
  const rv = useReveal({ delay: index == null ? 0 : stagger(index) });

  return (
    <a
      {...rv}
      href={post.href}
      className="rv relative block h-[380px] overflow-hidden rounded-lg bg-mist p-1 min-[639.98px]:h-[480px]"
    >
      {/* image layer: full-bleed, own 4px radius inside the cream frame */}
      <div className="absolute inset-0 overflow-hidden rounded">
        <img src={post.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="grad-card absolute inset-0" />
        <ImgBlur />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <div className="flex flex-wrap gap-2">
          <span className="chip">{post.tag}</span>
          <span className="chip">{post.read}</span>
        </div>
        <h3 className="t-h3l max-w-full text-mist" style={{ maxWidth: titleW }}>
          {post.title}
        </h3>
      </div>
    </a>
  );
}

export default function JournalPage() {
  const page = PAGES["/blog"];

  useEffect(() => {
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", page.description);
  }, [page]);

  const { badge, title, sub, featured, categories, posts } = JOURNAL_PAGE;

  const [selected, setSelected] = useState(null);
  const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
  const visiblePosts = selected
    ? posts.filter((p) => normalize(p.tag) === normalize(selected))
    : posts;

  return (
    <>
      <Navbar variant="dark" />
      <main>
        <section className="page-sec container-x flex flex-col gap-8 min-[639.98px]:gap-12">
          {/* header row */}
          <div className="flex flex-col items-start gap-4 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between min-[900px]:gap-8">
            <div className="flex w-full min-w-0 flex-col gap-2" style={{ maxWidth: 560 }}>
              <Eyebrow>{badge}</Eyebrow>
              <h1 className="t-h1p">
                <Words text={title} />
              </h1>
            </div>
            <p className="t-body w-full min-w-0 text-left min-[900px]:text-right" style={{ maxWidth: 706 }}>
              {sub}
            </p>
          </div>

          <PostCard post={featured} titleW={420} />

          {/* categories + post grid */}
          <div className="flex flex-col gap-8 min-[639.98px]:gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="t-h2">Categories</h2>
              <div className="flex flex-wrap gap-[10px]">
                {categories.map((c, i) => {
                  const isAll = i === 0;
                  const active = isAll ? selected === null : normalize(selected) === normalize(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelected(isAll ? null : active ? null : c)}
                      className={`rounded-lg px-4 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        active ? "bg-primary" : "bg-mist hover:bg-e4"
                      }`}
                    >
                      <span className={`t-link ${active ? "text-mist" : "text-smoke"}`}>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {visiblePosts.length ? (
              <div className="grid grid-cols-1 gap-6 min-[639.98px]:grid-cols-2 min-[1100px]:grid-cols-3">
                {visiblePosts.map((p, i) => (
                  <PostCard key={p.href} post={p} titleW={366} index={i} />
                ))}
              </div>
            ) : (
              <p className="t-body">No posts in this category yet</p>
            )}
          </div>
        </section>

        <Faq />
      </main>
      <Footer />
    </>
  );
}
