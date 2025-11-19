// src/helpers/mascotHelper.ts

const IMAGES = {
  go: "/mascots/gopher.png",
  react: "/mascots/react-ninja.png",
  redis: "/mascots/redis.png",
  cassandra: "/mascots/cassandra-eye.png",
  docker: "/mascots/docker-whale.png",
  default: "/mascots/placeholder.png", // Um fallback
};

const COLORS = {
  go: "#00ADD8",
  react: "#61DAFB",
  redis: "#DC382D",
  cassandra: "#1287B1",
  docker: "#2496ED",
  default: "#999999",
};

export function getMascotDetails(name: string) {
  // Normaliza o nome para comparar (ex: "Go Lang" -> "go")
  const normalized = name.toLowerCase();

  if (normalized.includes("go")) return { img: IMAGES.go, color: COLORS.go };
  if (normalized.includes("react"))
    return { img: IMAGES.react, color: COLORS.react };
  if (normalized.includes("redis"))
    return { img: IMAGES.redis, color: COLORS.redis };
  if (normalized.includes("cassandra"))
    return { img: IMAGES.cassandra, color: COLORS.cassandra };
  if (normalized.includes("docker"))
    return { img: IMAGES.docker, color: COLORS.docker };

  // Se não conhecer, retorna o padrão
  return { img: IMAGES.default, color: COLORS.default };
}
