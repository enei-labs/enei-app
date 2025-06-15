import { Box, Skeleton, Typography } from "@mui/material";

interface ChartSkeletonProps {
  title: string;
}

export function ChartSkeleton({ title }: ChartSkeletonProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">{title}</Typography>
        <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "end", gap: 1, height: 400 }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={Math.random() * 200 + 100}
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
        ))}
      </Box>
    </Box>
  );
} 