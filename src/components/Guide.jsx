import { GUIDE_SECTION } from "../data/content.js";
import { Eyebrow } from "./ui.jsx";

export default function Guide() {
  const { badge, title, sectionBody1, sectionBody2, storyImage, storyImageAlt } = GUIDE_SECTION;

  return (
    <section className="section-py">
      <div className="container-x flex flex-col gap-8 min-[1100px]:flex-row min-[1100px]:justify-between min-[1100px]:gap-6">
        {/* left column */}
        <div className="w-full min-w-0" style={{ maxWidth: 610 }}>
          <Eyebrow>{badge}</Eyebrow>
          <h2 className="t-h2 mt-2">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="t-body mt-4 max-w-[480px]">{sectionBody1}</p>
          <p className="t-body mt-2 max-w-[480px]">{sectionBody2}</p>
        </div>

        {/* section photo */}
        <div className="relative h-[380px] w-full overflow-hidden rounded-lg min-[639.98px]:h-[491px] min-[1100px]:w-[609px] min-[1100px]:shrink-0">
          <img
            src={storyImage}
            alt={storyImageAlt}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          />
        </div>
      </div>
    </section>
  );
}
