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
    columnGap: "8px",
    "& .name": {
      fontSize: "16px",
      fontWeight: 500,
    },
    "& .name:hover": {
      color: "text.primary",
    },
  },
} as const;

export default function IconBreadcrumbs(props: BreadcrumbProps) {
  const { items = [] } = props;

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {items.map(({ icon: Icon, href, name }) => (
          <Box sx={styles.link} key={href}>
            <Icon />
            <Link className="name" href={href}>
              {name}
            </Link>
          </Box>
        ))}
      </Breadcrumbs>
    </div>
  );
}
