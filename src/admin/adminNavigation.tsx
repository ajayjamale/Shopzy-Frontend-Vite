import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import type { ReactNode } from "react";

export type AdminLocationLike = {
  pathname: string;
  search: string;
};

export type AdminNavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  description: string;
  shortLabel?: string;
  badgeKey?: "pendingSellers";
};

export type AdminNavGroup = {
  title: string;
  description: string;
  items: AdminNavItem[];
};

export const adminMenuGroups: AdminNavGroup[] = [
  {
    title: "Overview",
    description: "Start from the marketplace overview and high-level health checks.",
    items: [
      {
        label: "Dashboard",
        shortLabel: "Overview",
        path: "/admin",
        icon: <DashboardRoundedIcon sx={{ fontSize: 16 }} />,
        description: "See live marketplace health, activity queues, returns, and settlements in one place.",
      },
    ],
  },
  {
    title: "People & Commerce",
    description: "Manage marketplace participants, offers, and customer-facing promotions.",
    items: [
      {
        label: "Users & Sellers",
        shortLabel: "Sellers",
        path: "/admin/users?tab=sellers",
        icon: <StorefrontRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Review seller onboarding, seller status, and marketplace participant activity.",
        badgeKey: "pendingSellers",
      },
      {
        label: "Customers",
        shortLabel: "Customers",
        path: "/admin/users?tab=customers",
        icon: <GroupRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Browse customer accounts and keep marketplace users organized.",
      },
      {
        label: "Coupons",
        shortLabel: "Coupons",
        path: "/admin/coupon",
        icon: <ConfirmationNumberRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Monitor coupon inventory, live codes, and reusable discount campaigns.",
      },
      {
        label: "Create Coupon",
        shortLabel: "New Coupon",
        path: "/admin/add-coupon",
        icon: <DashboardCustomizeRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Launch a new coupon campaign with eligibility, timing, and discount rules.",
      },
    ],
  },
  {
    title: "Homepage & Promotions",
    description: "Control the storefront presentation, homepage content, and deal visibility.",
    items: [
      {
        label: "Home Content Studio",
        shortLabel: "Home Content",
        path: "/admin/home-content",
        icon: <HomeRepairServiceRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Edit homepage sections, visibility, and content order from one workspace.",
      },
      {
        label: "Daily Discounts",
        shortLabel: "Discounts",
        path: "/admin/daily-discounts",
        icon: <LocalOfferRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Manage discount cards, promotional windows, and homepage offer placement.",
      },
    ],
  },
  {
    title: "Operations",
    description: "Handle payout flows, after-sales requests, and operational follow-up queues.",
    items: [
      {
        label: "Settlements",
        shortLabel: "Settlements",
        path: "/admin/settlements",
        icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Track payout volume, settlement progress, and finance workflow bottlenecks.",
      },
      {
        label: "Returns",
        shortLabel: "Returns",
        path: "/admin/returns",
        icon: <AssignmentReturnRoundedIcon sx={{ fontSize: 16 }} />,
        description: "Review return requests, refund state, and operational follow-ups.",
      },
    ],
  },
];

export const adminNavItems = adminMenuGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupTitle: group.title, groupDescription: group.description }))
);

const splitNavPath = (path: string) => {
  const [pathname, queryString = ""] = path.split("?");
  return {
    pathname,
    query: new URLSearchParams(queryString),
  };
};

export const isAdminNavItemActive = (location: AdminLocationLike, item: AdminNavItem) => {
  const { pathname, query } = splitNavPath(item.path);
  const currentQuery = new URLSearchParams(location.search);
  const queryMatches =
    Array.from(query.entries()).every(([key, value]) => currentQuery.get(key) === value);

  if (pathname === "/admin") {
    return (location.pathname === "/admin" || location.pathname === "/admin/") && queryMatches;
  }

  return (location.pathname === pathname || location.pathname.startsWith(`${pathname}/`)) && queryMatches;
};

export const findAdminNavItem = (location: AdminLocationLike) =>
  adminMenuGroups
    .flatMap((group) => group.items.map((item) => ({ item, group })))
    .find(({ item }) => isAdminNavItemActive(location, item));

export const getAdminPageMeta = (location: AdminLocationLike) => {
  const match = findAdminNavItem(location);
  if (match) {
    return {
      title: match.item.label,
      description: match.item.description,
      groupTitle: match.group.title,
      groupDescription: match.group.description,
      currentItem: match.item,
    };
  }

  const fallbackSegment = location.pathname
    .replace(/^\/admin\/?/, "")
    .split("/")[0]
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: fallbackSegment || "Dashboard",
    description: "Admin workspace",
    groupTitle: "Overview",
    groupDescription: "Shared admin tools and platform controls.",
    currentItem: null,
  };
};

export const getAdminContextLinks = (location: AdminLocationLike) => {
  const match = findAdminNavItem(location);
  if (match) {
    return match.group.items;
  }

  return adminMenuGroups.flatMap((group) => group.items).slice(0, 5);
};

export const getAdminBreadcrumbs = (location: AdminLocationLike) => {
  const meta = getAdminPageMeta(location);
  return [
    { label: "Admin Console", path: "/admin" },
    { label: meta.groupTitle, path: meta.currentItem?.path || location.pathname },
    { label: meta.title, path: location.pathname + location.search },
  ];
};
