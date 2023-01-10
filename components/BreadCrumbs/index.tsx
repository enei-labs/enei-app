import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

type Item = {
  href: string;
  icon: SvgIconComponent;
  name: string;
};

type BreadcrumbProps = {
  items: Item[];
};

const styles = {
  link: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
} as const;

export default function IconBreadcrumbs(props: BreadcrumbProps) {
  const { items = [] } = props;

  const [prevItems, lastItem] = [
    items.slice(0, items.length - 1),
    items[items.length - 1],
  ];

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {prevItems.map(({ icon: Icon, href, name }) => (
          <Box sx={styles.link} key={href}>
            <Icon />
            <Link href={href}>{name}</Link>
          </Box>
        ))}
        {lastItem && (
          <Link href={lastItem.href} aria-current="page">
            {lastItem.name}
          </Link>
        )}
      </Breadcrumbs>
    </div>
  );
}
