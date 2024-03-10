import wagonPhone from "./images/selector/wagon.png";
import msmPhone from "./images/selector/msm.png";
import omsistuffPhone from "./images/selector/omsistuff.png";
import thesesPhone from "./images/selector/theses.png";
import kppPhone from "./images/selector/kpp.png";
import { v4 } from "uuid";
import type { ProjectDetails } from "./components/ProjectsSelector.astro";

export const wagonProject: ProjectDetails = {
  id: v4(),
  title: "Wagon",
  frame: wagonPhone,
};

export const msmProject: ProjectDetails = {
  id: v4(),
  title: "Mont-Saint-Michel",
  frame: msmPhone,
};

export const omsistuffProject: ProjectDetails = {
  id: v4(),
  title: "Omsistuff",
  frame: omsistuffPhone,
};

export const thesesProject: ProjectDetails = {
  id: v4(),
  title: "Thèses",
  frame: thesesPhone,
};

export const kppProject: ProjectDetails = {
  id: v4(),
  title: "KPP Maker",
  frame: kppPhone,
};

export const projects = [
  wagonProject,
  omsistuffProject,
  msmProject,
  thesesProject,
  kppProject,
];
