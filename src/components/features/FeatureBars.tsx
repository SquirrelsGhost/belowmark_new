const BAR_HEIGHTS = ["h-[35%]", "h-[55%]", "h-[42%]", "h-[70%]", "h-[58%]", "h-[82%]", "h-[64%]", "h-[95%]", "h-[76%]", "h-[88%]", "h-[60%]", "h-[100%]"] as const;

/** Decorative bar chart that brightens on card hover. */
export default function FeatureBars() {
  return (
    <div aria-hidden="true" className="flex h-32 items-end gap-2">
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={`flex-1 rounded-t-md bg-gradient-to-t from-iris-deep/30 to-iris/60 opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${height}`}
        />
      ))}
    </div>
  );
}
