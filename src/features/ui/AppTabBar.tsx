import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    to: "/",
    label: "홈",
    end: true,
  },
  {
    to: "/tracking",
    label: "알림",
  },
  {
    to: "/settings",
    label: "설정",
  },
];

export function AppTabBar() {
  return (
    <nav className="app-tabBar" aria-label="주요 탭">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? "app-tabBar__link is-active" : "app-tabBar__link")}
        >
          <span className="app-tabBar__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
