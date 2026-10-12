import { useEffect, useState } from "react";

const imageCache = new Map();

export default function CastImage({ person }) {
  const name =
    typeof person === "string"
      ? person
      : person?.name || "Cast member";

  const suppliedImage =
    typeof person === "object"
      ? person?.image || person?.photo || ""
      : "";

  const [image, setImage] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setImage("");
    setFailed(false);

    async function findImage() {
      if (suppliedImage) {
        setImage(suppliedImage);
        return;
      }

      if (imageCache.has(name)) {
        const cached = imageCache.get(name);
        if (!cancelled) {
          setImage(cached || "");
          setFailed(!cached);
        }
        return;
      }

      try {
        const params = new URLSearchParams({
          action: "query",
          generator: "search",
          gsrsearch: `${name} actor`,
          gsrnamespace: "0",
          gsrlimit: "10",
          prop: "pageimages",
          piprop: "thumbnail",
          pithumbsize: "400",
          format: "json",
          origin: "*",
        });

        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?${params}`
        );

        if (!response.ok) {
          throw new Error("Could not fetch actor images");
        }

        const data = await response.json();
        const pages = Object.values(data.query?.pages || {});

        const normalizedName = name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        const exactMatch = pages.find((page) => {
          const title = page.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          return title === normalizedName && page.thumbnail?.source;
        });

        const result =
          exactMatch?.thumbnail?.source ||
          pages.find((page) => page.thumbnail?.source)?.thumbnail?.source ||
          "";

        imageCache.set(name, result);

        if (!cancelled) {
          setImage(result);
          setFailed(!result);
        }
      } catch (error) {
        console.error(`Actor image unavailable for ${name}:`, error);

        if (!cancelled) {
          setFailed(true);
        }
      }
    }

    findImage();

    return () => {
      cancelled = true;
    };
  }, [name, suppliedImage]);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-950">
      {image && !failed ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full rounded-full object-cover"
          onError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <span className="text-2xl font-bold text-white">
          {initials}
        </span>
      )}
    </div>
  );
}