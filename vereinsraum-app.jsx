import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  Beer,
  Users,
  Headphones,
  ShieldCheck,
  Wine,
  Coffee,
  Martini,
  GlassWater,
  Candy,
  Plus,
  Minus,
  Trash2,
  Banknote,
  Smartphone,
  FileText,
  Check,
  X,
  Search,
  Receipt,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  UserRound,
  Delete,
  PartyPopper,
  ClipboardList,
  Download,
  Pencil,
  BarChart3,
  Menu,
  LogOut,
  Loader2,
  Wrench,
  ListMusic,
  Volume2,
  UserPlus,
  Package,
  RotateCcw,
  CalendarRange,
  Cpu,
  Store,
  AlertTriangle,
  Folder,
  MessageCircle,
  Link2,
  Send,
  CalendarPlus,
} from "lucide-react";

// ---------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------
const colors = {
  bg: "#12141A",
  surface: "#1B1E26",
  surfaceRaised: "#242833",
  hairline: "#2E323E",
  amber: "#E8A33D",
  teal: "#5FD0C0",
  text: "#F2EFE9",
  textMuted: "#8B909A",
  danger: "#E1636B",
};
const display = { fontFamily: "'Oswald', sans-serif" };
const body = { fontFamily: "'Inter', sans-serif" };
const chf = (n) => (Number(n) || 0).toFixed(2) + " CHF";
const now = () => new Date().toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });

// ---------------------------------------------------------------
// Rollen — jede Person hat ihren eigenen Zugang (Name + PIN),
// nicht mehr ein geteilter Code pro Rolle.
// ---------------------------------------------------------------
const ROLE_META = {
  gast: { label: "Gast", tabs: ["kalender"] },
  mitglied: { label: "Mitglied", tabs: ["kalender", "kasse", "dokumente", "chat", "ideenbox", "galerie"] },
  barteam: { label: "Barteam", tabs: ["kalender", "kasse", "dienste", "dokumente", "chat", "ideenbox", "galerie"] },
  dj: { label: "DJ", tabs: ["kalender", "dj", "dienste", "dokumente", "chat", "ideenbox", "galerie"] },
  vorstand: { label: "Vorstand", tabs: ["startseite", "kalender", "kasse", "dienste", "dj", "dokumente", "chat", "ideenbox", "galerie"] },
  admin: { label: "Administrator", tabs: ["startseite", "kalender", "kasse", "dienste", "dj", "dokumente", "chat", "ideenbox", "galerie"] },
};

// Bereiche mit eigener Bearbeiten-Berechtigung (getrennt von "sichtbar")
const EDITABLE_AREAS = [
  { id: "dienste", label: "Dienste (Schichten planen)" },
  { id: "dj", label: "DJ (Lineup bearbeiten)" },
  { id: "dokumente", label: "Dokumente (hochladen)" },
  { id: "veranstaltungen", label: "Veranstaltungen (planen)" },
];

const defaultRolePermissions = () => {
  const perms = {};
  Object.entries(ROLE_META).forEach(([roleId, meta]) => {
    perms[roleId] = {
      tabs: [...meta.tabs],
      canEdit: {
        dienste: ["vorstand", "admin"].includes(roleId),
        dj: ["dj", "vorstand", "admin"].includes(roleId),
        dokumente: ["vorstand", "admin"].includes(roleId),
        veranstaltungen: ["vorstand", "admin"].includes(roleId),
      },
    };
  });
  return perms;
};

const VORSTAND_POSITIONS = ["Präsident", "Vizepräsident", "Kassier", "Aktuar", "Beisitzer"];

const DEFAULT_STAFF = [
  { id: 101, name: "Daniel Silberman", role: "vorstand", position: "Präsident", pin: "2824", setupToken: "lfxctncsbp" },
  { id: 102, name: "Sascha Hess", role: "vorstand", position: "Vizepräsident", pin: "1409", setupToken: "cdp3eiw8uo" },
  { id: 103, name: "Markus Kalt", role: "vorstand", position: "Kassier", pin: "5506", setupToken: "9b4kfel3gu" },
  { id: 104, name: "Roger Güdel", role: "vorstand", position: "Beisitzer", pin: "5012", setupToken: "xntcchyplv" },
  { id: 105, name: "Ralph Schlumpf", role: "mitglied", position: "", pin: "4657", setupToken: "qk2zius50k" },
  { id: 106, name: "Ivan Gumy", role: "admin", position: "", pin: "3286", setupToken: "9ep1frby1u" },
  { id: 107, name: "Daniel Landolt", role: "mitglied", position: "", pin: "2679", setupToken: "5lzvuq48rx" },
  { id: 108, name: "Claudio Gerussi", role: "mitglied", position: "", pin: "9935", setupToken: "czx93knyaq" },
  { id: 109, name: "Sofia McGlynn", role: "mitglied", position: "", pin: "2424", setupToken: "gec1eio5cq" },
  { id: 110, name: "Diego Jauss", role: "mitglied", position: "", pin: "7912", setupToken: "t535kom58f" },
  { id: 111, name: "Sabrina Gulijaj", role: "mitglied", position: "", pin: "1520", setupToken: "giirvjapnu" },
  { id: 112, name: "Tristan Brzoska", role: "mitglied", position: "", pin: "1488", setupToken: "8yswyb6252" },
  { id: 113, name: "Jürg Zweifel", role: "mitglied", position: "", pin: "2535", setupToken: "oodwcchfmb" },
  { id: 114, name: "Kristina Krajinovic", role: "mitglied", position: "", pin: "4582", setupToken: "afdna5wfjm" },
  { id: 115, name: "Reto Fischer", role: "mitglied", position: "", pin: "4811", setupToken: "ne49qrddmj" },
  { id: 116, name: "Dominic Adank", role: "mitglied", position: "", pin: "9279", setupToken: "3fa8tftat9" },
  { id: 117, name: "Michael Windmeier", role: "mitglied", position: "", pin: "1434", setupToken: "5zjng1t2li" },
  { id: 118, name: "Miri", role: "mitglied", position: "", pin: "4257", setupToken: "394330ismb" },
  { id: 119, name: "Pascal Ulrich", role: "mitglied", position: "", pin: "9928", setupToken: "bkjy8q798n" },
  { id: 120, name: "Francesco Tarallo", role: "mitglied", position: "", pin: "7873", setupToken: "hihhw64rx2" },
  { id: 121, name: "Miriam Hiltebrand", role: "mitglied", position: "", pin: "4611", setupToken: "dx621rg2l2" },
  { id: 122, name: "Tina Huber", role: "mitglied", position: "", pin: "8359", setupToken: "8oo80gef63" },
  { id: 123, name: "Dominik Schütz", role: "mitglied", position: "", pin: "5557", setupToken: "f39xmtea8x" },
  { id: 124, name: "Michael Bosshard", role: "mitglied", position: "", pin: "1106", setupToken: "s7p53hjkiv" },
  { id: 125, name: "Andreas Losenegger", role: "mitglied", position: "", pin: "3615", setupToken: "jpe6mqv6p7" },
  { id: 126, name: "Nadja Pedrazuela", role: "mitglied", position: "", pin: "7924", setupToken: "stsapga2gr" },
  { id: 127, name: "Vincent Mertenat", role: "mitglied", position: "", pin: "6574", setupToken: "0ulst2duij" },
  { id: 128, name: "Pascal Brunner", role: "mitglied", position: "", pin: "5552", setupToken: "1su16pwssy" },
  { id: 129, name: "Thomas Peterhans", role: "mitglied", position: "", pin: "3547", setupToken: "qtr7z57ju7" },
  { id: 130, name: "Steffi Halka", role: "mitglied", position: "", pin: "4527", setupToken: "4eepcicy26" },
  { id: 131, name: "Roland Vogt", role: "mitglied", position: "", pin: "6514", setupToken: "fzxf58h8or" },
  { id: 132, name: "Stefan Schmidt", role: "mitglied", position: "", pin: "2674", setupToken: "93fpsmhlza" },
  { id: 133, name: "Melanie Güdel", role: "mitglied", position: "", pin: "2519", setupToken: "tpalwsc928" },
  { id: 134, name: "Lilliane Güdel", role: "mitglied", position: "", pin: "7224", setupToken: "djb2jep63j" },
  { id: 135, name: "Sebastian Steiner", role: "mitglied", position: "", pin: "2584", setupToken: "f7uzdcypc7" },
  { id: 136, name: "Marko Boman", role: "mitglied", position: "", pin: "6881", setupToken: "w2d4c5qmt7" },
  { id: 137, name: "Jens", role: "mitglied", position: "", pin: "6635", setupToken: "jesidfbhlk" },
  { id: 138, name: "Marc Behnke", role: "mitglied", position: "", pin: "5333", setupToken: "1ksgmaja0t" },
  { id: 139, name: "Jan Honaur", role: "mitglied", position: "", pin: "1711", setupToken: "gr7d3pr4os" },
  { id: 140, name: "Luciana Parada", role: "mitglied", position: "", pin: "8527", setupToken: "y9m3zwombe" },
  { id: 141, name: "Harald Jaberg", role: "mitglied", position: "", pin: "9785", setupToken: "c0jfd45yki" },
  { id: 142, name: "Melanie Matoori", role: "mitglied", position: "", pin: "3045", setupToken: "kqfqj89ti8" },
  { id: 143, name: "Ivo Püntener", role: "mitglied", position: "", pin: "7201", setupToken: "lmanrshsaj" },
  { id: 144, name: "Nicki Wehrli", role: "mitglied", position: "", pin: "2291", setupToken: "dobakivt1x" },
  { id: 145, name: "Iris Wehrli", role: "mitglied", position: "", pin: "5803", setupToken: "z5ol9f0xb4" },
  { id: 146, name: "David Gamez", role: "mitglied", position: "", pin: "6925", setupToken: "6w03fss423" },
  { id: 147, name: "Andy Galbier", role: "mitglied", position: "", pin: "4150", setupToken: "v6yyibemd4" },
  { id: 148, name: "Diana Stünzi", role: "mitglied", position: "", pin: "2139", setupToken: "uwwyra20st" },
  { id: 149, name: "Ita Baumann", role: "mitglied", position: "", pin: "1750", setupToken: "xc0jcj0h09" },
  { id: 150, name: "Simone Stamm", role: "mitglied", position: "", pin: "4733", setupToken: "rnry1wxcfj" },
  { id: 151, name: "Severino Blatter", role: "mitglied", position: "", pin: "5741", setupToken: "0kuacjyyyk" },
  { id: 152, name: "Angelo Pescarini", role: "mitglied", position: "", pin: "2307", setupToken: "sqqe6h97aq" },
  { id: 153, name: "Rolf Waespi", role: "mitglied", position: "", pin: "4814", setupToken: "38qjh8hufs" },
  { id: 154, name: "Andy Gehrig", role: "mitglied", position: "", pin: "2654", setupToken: "8e3s5zi6ra" },
  { id: 155, name: "Florian Hofer", role: "mitglied", position: "", pin: "7227", setupToken: "arqkfml4a1" },
  { id: 156, name: "Sandra Famos", role: "mitglied", position: "", pin: "5554", setupToken: "4e7z6kno9v" },
  { id: 157, name: "Kim Schwalm", role: "mitglied", position: "", pin: "8428", setupToken: "mpjbd4k7ij" },
  { id: 158, name: "Beat Schnorf", role: "mitglied", position: "", pin: "6977", setupToken: "sgn853w67t" },
  { id: 159, name: "Javier Kommotar", role: "mitglied", position: "", pin: "3664", setupToken: "zb0q1xkb7e" },
  { id: 160, name: "Thomas Simon", role: "mitglied", position: "", pin: "7065", setupToken: "qmk09jxkuo" },
  { id: 161, name: "Jonas Bauer", role: "mitglied", position: "", pin: "6820", setupToken: "gfh6rh69qf" },
  { id: 162, name: "Roman Wilke", role: "mitglied", position: "", pin: "4432", setupToken: "gdmdiju50o" },
  { id: 163, name: "Reto Trachsler", role: "mitglied", position: "", pin: "5374", setupToken: "osnmcj8esw" },
  { id: 164, name: "Nimal Schnyder", role: "mitglied", position: "", pin: "2169", setupToken: "5hjioq845a" },
  { id: 165, name: "Adrian Danech", role: "mitglied", position: "", pin: "3803", setupToken: "bz6rvao734" },
  { id: 166, name: "Edoardo Dardi", role: "mitglied", position: "", pin: "9751", setupToken: "9idfsy7zx1" },
  { id: 167, name: "Matthias Enders", role: "mitglied", position: "", pin: "5010", setupToken: "qtb2i7xkej" },
  { id: 168, name: "Anandi Göltenboth", role: "mitglied", position: "", pin: "3677", setupToken: "wzecsuniva" },
  { id: 169, name: "Moreno Perdono", role: "mitglied", position: "", pin: "8573", setupToken: "kq8x5rii8z" },
  { id: 170, name: "Kathrin Scholz", role: "mitglied", position: "", pin: "7216", setupToken: "larypjy7ib" },
  { id: 171, name: "Sascha Häfliger", role: "mitglied", position: "", pin: "5422", setupToken: "mpyh20sh8l" },
  { id: 172, name: "Remo Rohr", role: "mitglied", position: "", pin: "4598", setupToken: "3ih1k8rgip" },
  { id: 173, name: "Reto Hübner", role: "mitglied", position: "", pin: "6313", setupToken: "x8foh9fbco" },
  { id: 174, name: "Jessica Escher", role: "mitglied", position: "", pin: "1916", setupToken: "65097lg70b" },
  { id: 175, name: "Luca Gut", role: "mitglied", position: "", pin: "4752", setupToken: "xnnlgakm8e" },
  { id: 176, name: "Andrew Demsar", role: "mitglied", position: "", pin: "1525", setupToken: "8hm33pbrn7" },
  { id: 177, name: "Andrew Houillebecq", role: "mitglied", position: "", pin: "6168", setupToken: "gn6bo31bbc" },
  { id: 178, name: "Wolfgang Sibold", role: "mitglied", position: "", pin: "7572", setupToken: "7j06mj8wjz" },
  { id: 179, name: "Janine Janko", role: "mitglied", position: "", pin: "5386", setupToken: "lja16w7air" },
  { id: 180, name: "Lorenz Zbinden", role: "mitglied", position: "", pin: "2084", setupToken: "88njpr7g20" },
  { id: 181, name: "Andy Marr", role: "mitglied", position: "", pin: "4456", setupToken: "31vlln2ch1" },
  { id: 182, name: "Fabio Gurini", role: "mitglied", position: "", pin: "6155", setupToken: "icbtl959jd" },
  { id: 183, name: "Heli Schmiedheini", role: "mitglied", position: "", pin: "4483", setupToken: "drzqipwy04" },
  { id: 184, name: "Roger Ruf", role: "mitglied", position: "", pin: "9179", setupToken: "xe4kun0hii" },
  { id: 185, name: "Moira Kraszewski", role: "mitglied", position: "", pin: "7482", setupToken: "f5ulo9si3x" },
  { id: 186, name: "David Aschwanden", role: "mitglied", position: "", pin: "8517", setupToken: "9dr346bkeg" },
  { id: 187, name: "Marion Burgener", role: "mitglied", position: "", pin: "3340", setupToken: "9u7n5qj18d" },
  { id: 188, name: "Dany Schlatter", role: "mitglied", position: "", pin: "5339", setupToken: "vwhnfhjvxh" },
  { id: 189, name: "Steffen Bonn", role: "mitglied", position: "", pin: "3287", setupToken: "alyglh2tcd" },
  { id: 190, name: "Hector Glass", role: "mitglied", position: "", pin: "5040", setupToken: "otxdfzokl8" },
  { id: 191, name: "Angie Troglia", role: "mitglied", position: "", pin: "9830", setupToken: "lumo59nh0h" },
  { id: 192, name: "Roger Nater", role: "mitglied", position: "", pin: "5304", setupToken: "a6p3o5qfat" },
  { id: 193, name: "Renè Hochstrasser", role: "mitglied", position: "", pin: "8019", setupToken: "x6dwnsfks7" },
  { id: 194, name: "Igor Stamenkovic", role: "mitglied", position: "", pin: "7543", setupToken: "dr28he79rb" },
  { id: 195, name: "Eddy Waldmeier", role: "mitglied", position: "", pin: "6930", setupToken: "7n6w3f2ho4" },
  { id: 196, name: "Gleb Brezger", role: "mitglied", position: "", pin: "4593", setupToken: "3ghosnei06" },
  { id: 197, name: "Patricia Zajac", role: "mitglied", position: "", pin: "3266", setupToken: "bu1b4evtwl" },
  { id: 198, name: "Abraham Schiffmann", role: "mitglied", position: "", pin: "9348", setupToken: "pupxqpawri" },
  { id: 199, name: "Silvana Cattaneo", role: "mitglied", position: "", pin: "9085", setupToken: "12qgrdepdp" },
  { id: 200, name: "Janina Vögele", role: "mitglied", position: "", pin: "2489", setupToken: "sbwc01sbsn" },
  { id: 201, name: "Adriano da Silva", role: "mitglied", position: "", pin: "1771", setupToken: "8e4903g9r8" },
  { id: 202, name: "Patrick Adelantado", role: "mitglied", position: "", pin: "2796", setupToken: "6f27cm1f6j" },
  { id: 203, name: "Riina Schulze", role: "mitglied", position: "", pin: "3504", setupToken: "3fs7hjslbg" },
];

const TAB_META = {
  kalender: { label: "Kalender", icon: CalendarDays },
  kasse: { label: "Kasse", icon: Receipt },
  dienste: { label: "Dienste", icon: Users },
  dj: { label: "DJ", icon: Headphones },
  dokumente: { label: "Dokumente", icon: Folder },
  chat: { label: "Chat", icon: MessageCircle },
  tagesabschluss: { label: "Abschluss", icon: ClipboardList },
  belege: { label: "Eigene Belege", icon: FileText },
  admin: { label: "Verwaltung", icon: ShieldCheck },
  veranstaltungen: { label: "Veranstaltungen", icon: CalendarPlus },
  startseite: { label: "Startseite", icon: BarChart3 },
  ideenbox: { label: "Ideenbox", icon: MessageCircle },
  rechte: { label: "Rechte & Rollen", icon: ShieldCheck },
  galerie: { label: "Galerie", icon: Folder },
  suche: { label: "Suche", icon: Search },
  finanzen: { label: "Finanzübersicht", icon: BarChart3 },
  backup: { label: "Backup", icon: RotateCcw },
};

// ---------------------------------------------------------------
// Preisstufen & Katalog
// ---------------------------------------------------------------
const TIERS = [
  { id: "aktiv", label: "Aktiv" },
  { id: "goenner", label: "Gönner" },
  { id: "passiv", label: "Passiv" },
];
const tierColor = { aktiv: colors.teal, goenner: colors.amber, passiv: colors.danger };
const tp = (base) => ({ aktiv: base, goenner: +(base + 1).toFixed(2), passiv: +(base + 2).toFixed(2) });

const CATEGORIES = [
  { id: "apfelwein-wein", label: "Apfelwein & Wein", icon: Wine },
  { id: "bier", label: "Bier", icon: Beer },
  { id: "cocktails-longdrinks", label: "Cocktails & Longdrinks", icon: Martini },
  { id: "flaschen-pur", label: "Flaschen (pur)", icon: Wine },
  { id: "gin-rum", label: "Gin & Rum", icon: Wine },
  { id: "kaffee-kiosk-snacks", label: "Kaffee, Kiosk & Snacks", icon: Coffee },
  { id: "shots", label: "Shots", icon: Candy },
  { id: "softdrinks", label: "Softdrinks", icon: GlassWater },
  { id: "tequila-hierbas", label: "Tequila & Hierbas", icon: Wine },
  { id: "vodka-whisky", label: "Vodka & Whisky", icon: Wine },
];

const RAW_ITEMS = [
  { id: 1, cat: "apfelwein-wein", name: "Wehntaler Apfelwein Mit/Ohni Alk", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 2, cat: "apfelwein-wein", name: "Wein / Prosecco – Pro 1 dl", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 3, cat: "apfelwein-wein", name: "Wein / Prosecco – Pro Flasche", prices: { aktiv: 12.0, goenner: 15.0, passiv: 20.0 } },
  { id: 4, cat: "apfelwein-wein", name: "Aperitive – Campari", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 5, cat: "apfelwein-wein", name: "Aperitive – Martini", prices: { aktiv: 1.5, goenner: 3.0, passiv: 4.0 } },
  { id: 6, cat: "bier", name: "Biere – Turbinenbräu Sprint", prices: { aktiv: 2.0, goenner: 3.0, passiv: 4.0 } },
  { id: 7, cat: "bier", name: "Biere – Appenzeller Naturperle", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 8, cat: "bier", name: "Biere – Rothaus Tannenzäpfle", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 9, cat: "bier", name: "Biere – Seebueb Porter", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 10, cat: "bier", name: "Biere – Paul 07", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 11, cat: "bier", name: "Biere – Appenzeller Hanfblüte", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 12, cat: "bier", name: "Biere – Baarer Goldmännli Spezial", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 13, cat: "bier", name: "Biere – Boxer Old", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 14, cat: "bier", name: "Biere – Dr. Gab's Swaf", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 15, cat: "bier", name: "Biere – Erdmännli Amber", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 16, cat: "bier", name: "Biere – Felsenau Bären Junker", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 17, cat: "bier", name: "Biere – Kitchen Brew IPA", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 18, cat: "bier", name: "Biere – Turbinenbräu Anti Nazi", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 19, cat: "bier", name: "Biere – Unser Bier Amber", prices: { aktiv: 3.0, goenner: 3.0, passiv: 4.0 } },
  { id: 20, cat: "bier", name: "Biere – Uster Bräu Spezial", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 21, cat: "cocktails-longdrinks", name: "Longdrink / Cocktail – Tequila Sunrise", prices: { aktiv: 5.5, goenner: 9.0, passiv: 11.0 } },
  { id: 22, cat: "cocktails-longdrinks", name: "Vodka Lemon / Cola / Orange", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 23, cat: "cocktails-longdrinks", name: "Vodka Lemon / Cola / Orange – Xellent", prices: { aktiv: 6.0, goenner: 9.0, passiv: 11.0 } },
  { id: 24, cat: "cocktails-longdrinks", name: "Vodka Lemon / Cola / Orange – Crystal Head", prices: { aktiv: 6.5, goenner: 10.0, passiv: 13.0 } },
  { id: 25, cat: "cocktails-longdrinks", name: "Vodka Mate / Red Bull", prices: { aktiv: 5.5, goenner: 9.0, passiv: 11.0 } },
  { id: 26, cat: "cocktails-longdrinks", name: "Vodka Mate / Red Bull – Xellent", prices: { aktiv: 6.5, goenner: 10.0, passiv: 13.0 } },
  { id: 27, cat: "cocktails-longdrinks", name: "Vodka Mate / Red Bull – Crystal Head", prices: { aktiv: 7.0, goenner: 11.0, passiv: 14.0 } },
  { id: 28, cat: "cocktails-longdrinks", name: "Whisky Cola", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 29, cat: "flaschen-pur", name: "Flaschen Alk (ohne Mixgetränk) – Berliner Luft", prices: { aktiv: 15.0, goenner: 20.0, passiv: 30.0 } },
  { id: 30, cat: "flaschen-pur", name: "Flaschen Alk (ohne Mixgetränk) – Gin White Socks (Bio)", prices: { aktiv: 30.0, goenner: 40.0, passiv: 50.0 } },
  { id: 31, cat: "flaschen-pur", name: "Flaschen Alk (ohne Mixgetränk) – Rum Ron De Marinero (Bio)", prices: { aktiv: 35.0, goenner: 50.0, passiv: 60.0 } },
  { id: 32, cat: "flaschen-pur", name: "Flaschen Alk (ohne Mixgetränk) – Vodka Wodotschka (Bio)", prices: { aktiv: 30.0, goenner: 40.0, passiv: 50.0 } },
  { id: 33, cat: "flaschen-pur", name: "Flaschen Alk (ohne Mixgetränk) – Whisky Famous Grouse", prices: { aktiv: 30.0, goenner: 40.0, passiv: 50.0 } },
  { id: 34, cat: "gin-rum", name: "Gin – White Socks (Bio) Standart", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 35, cat: "gin-rum", name: "Gin – Bombay Sapphire", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 36, cat: "gin-rum", name: "Ginuine Gin Alpine Herbs", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 37, cat: "gin-rum", name: "Gin – Monkey 47", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 38, cat: "gin-rum", name: "Gin – Siegfried Rheinland", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 39, cat: "gin-rum", name: "Rum – Ron De Marinero (Bio) Bianca / Oro Standart", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 40, cat: "gin-rum", name: "Züri Rum", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 41, cat: "kaffee-kiosk-snacks", name: "Kaffee – Tasse", prices: { aktiv: 1.0, goenner: 1.0, passiv: 2.0 } },
  { id: 42, cat: "kaffee-kiosk-snacks", name: "Kaffee Luz", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 43, cat: "kaffee-kiosk-snacks", name: "Kiosk – Parisienne", prices: { aktiv: 8.5, goenner: 9.0, passiv: 10.0 } },
  { id: 44, cat: "kaffee-kiosk-snacks", name: "Kiosk – Smoking Rolls", prices: { aktiv: 3.0, goenner: 4.0, passiv: 4.0 } },
  { id: 45, cat: "kaffee-kiosk-snacks", name: "Snacks – Hot Dog", prices: { aktiv: 4.0, goenner: 4.0, passiv: 4.0 } },
  { id: 46, cat: "kaffee-kiosk-snacks", name: "Snacks – Toast Chäs", prices: { aktiv: 3.0, goenner: 3.0, passiv: 3.0 } },
  { id: 47, cat: "kaffee-kiosk-snacks", name: "Snacks – Toast Schinke", prices: { aktiv: 4.0, goenner: 4.0, passiv: 4.0 } },
  { id: 48, cat: "cocktails-longdrinks", name: "Longdrink / Cocktail – Berliner Mojito", prices: { aktiv: 5.5, goenner: 9.0, passiv: 11.0 } },
  { id: 49, cat: "cocktails-longdrinks", name: "Longdrink / Cocktail – Caipirinha", prices: { aktiv: 5.5, goenner: 9.0, passiv: 11.0 } },
  { id: 50, cat: "cocktails-longdrinks", name: "Gin Tonic / Lemon", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 51, cat: "cocktails-longdrinks", name: "Gin Tonic / Lemon – Monkey 47", prices: { aktiv: 6.5, goenner: 10.0, passiv: 13.0 } },
  { id: 52, cat: "cocktails-longdrinks", name: "Gin Tonic / Lemon – Siegfried Rheinland", prices: { aktiv: 6.5, goenner: 10.0, passiv: 13.0 } },
  { id: 53, cat: "cocktails-longdrinks", name: "Gin Tonic / Lemon – Ginuine Gin", prices: { aktiv: 6.5, goenner: 10.0, passiv: 13.0 } },
  { id: 54, cat: "cocktails-longdrinks", name: "Hierbas Cola", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 55, cat: "cocktails-longdrinks", name: "Hierbas Cola – Mari Mayahs", prices: { aktiv: 5.5, goenner: 9.0, passiv: 11.0 } },
  { id: 56, cat: "cocktails-longdrinks", name: "Hierbas Cola – Tunel 14", prices: { aktiv: 6.5, goenner: 10.0, passiv: 13.0 } },
  { id: 57, cat: "cocktails-longdrinks", name: "Hierbas Cola – Long Island ICE Tea", prices: { aktiv: 8.0, goenner: 12.0, passiv: 16.0 } },
  { id: 58, cat: "cocktails-longdrinks", name: "Rum Cola", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 59, cat: "cocktails-longdrinks", name: "Rum Cola – Guajiara", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 60, cat: "cocktails-longdrinks", name: "Rum Cola – Züri Rum", prices: { aktiv: 6.0, goenner: 9.0, passiv: 11.0 } },
  { id: 61, cat: "shots", name: "Amaretto di Saronno", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 62, cat: "shots", name: "B52", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 63, cat: "shots", name: "Berliner Luft", prices: { aktiv: 1.5, goenner: 2.0, passiv: 3.0 } },
  { id: 64, cat: "shots", name: "Berliner Luft 40%", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 65, cat: "shots", name: "Brandy Carlos", prices: { aktiv: 3.0, goenner: 5.0, passiv: 6.0 } },
  { id: 66, cat: "shots", name: "Calvados Chateau du Breuil V.S.O.P", prices: { aktiv: 3.0, goenner: 5.0, passiv: 6.0 } },
  { id: 67, cat: "shots", name: "Flämmli", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 68, cat: "shots", name: "Frangelico Liqueur", prices: { aktiv: 2.0, goenner: 3.0, passiv: 4.0 } },
  { id: 69, cat: "shots", name: "Jägermeister", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 70, cat: "shots", name: "Remy Martin XO", prices: { aktiv: 10.0, goenner: 15.0, passiv: 20.0 } },
  { id: 71, cat: "shots", name: "Sambucco Molina", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 72, cat: "softdrinks", name: "Vivi Kola / Zero", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 73, cat: "softdrinks", name: "Rivella Rot", prices: { aktiv: 2.0, goenner: 3.0, passiv: 4.0 } },
  { id: 74, cat: "softdrinks", name: "Red Bull", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 75, cat: "softdrinks", name: "Afri Cola Glas", prices: { aktiv: 1.5, goenner: 2.0, passiv: 3.0 } },
  { id: 76, cat: "softdrinks", name: "Afri Cola Flasche", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 77, cat: "softdrinks", name: "Appenzeller Citro", prices: { aktiv: 1.5, goenner: 2.0, passiv: 3.0 } },
  { id: 78, cat: "softdrinks", name: "ChariTea Mate", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 79, cat: "softdrinks", name: "Gazosa", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 80, cat: "softdrinks", name: "Ice Tea Bio Alpenkräuter Glas", prices: { aktiv: 1.5, goenner: 2.0, passiv: 3.0 } },
  { id: 81, cat: "softdrinks", name: "Ice Tea Bio Alpenkräuter 1l", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 82, cat: "softdrinks", name: "Loris Mate", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 83, cat: "softdrinks", name: "Michel O-Saft Glas", prices: { aktiv: 2.0, goenner: 3.0, passiv: 4.0 } },
  { id: 84, cat: "softdrinks", name: "Michel O-Saft Flasche", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 85, cat: "softdrinks", name: "Sirup", prices: { aktiv: 1.0, goenner: 1.0, passiv: 2.0 } },
  { id: 86, cat: "softdrinks", name: "Tonic Water Thomas Henry Glas", prices: { aktiv: 2.0, goenner: 3.0, passiv: 4.0 } },
  { id: 87, cat: "softdrinks", name: "Tonic Water Thomas Henry Flasche", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 88, cat: "softdrinks", name: "Vivi Mate", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 89, cat: "tequila-hierbas", name: "Tequila – Jose Cuervo Silver / Reposado Standart", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 90, cat: "tequila-hierbas", name: "Tequila – Don Julio Blanco", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 91, cat: "tequila-hierbas", name: "Tequila – Don Julio Reposado", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 92, cat: "tequila-hierbas", name: "Tequila – Buen Amigo Reposado", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 93, cat: "tequila-hierbas", name: "Hierbas (blau) Standart", prices: { aktiv: 2.5, goenner: 4.0, passiv: 5.0 } },
  { id: 94, cat: "tequila-hierbas", name: "Hierbas Mari Mayahs", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 95, cat: "tequila-hierbas", name: "Hierbas Tunel 14", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 96, cat: "vodka-whisky", name: "Vodka – Wodotschka (Bio) Standart", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 97, cat: "vodka-whisky", name: "Vodka – Xellent", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 98, cat: "vodka-whisky", name: "Vodka – Crystal Head", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 99, cat: "vodka-whisky", name: "Vodka – Stolichnaya", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
  { id: 100, cat: "vodka-whisky", name: "Whisky – Famous Grouse Standart", prices: { aktiv: 2.5, goenner: 3.0, passiv: 4.0 } },
  { id: 101, cat: "vodka-whisky", name: "Whisky – Wild Turkey Rye", prices: { aktiv: 3.0, goenner: 4.0, passiv: 5.0 } },
  { id: 102, cat: "vodka-whisky", name: "Whisky – The Glenlivet Founder’s Reserve", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 103, cat: "vodka-whisky", name: "Whisky – Talisker Skye", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 104, cat: "vodka-whisky", name: "Whisky – Talisker 10 Years", prices: { aktiv: 3.5, goenner: 5.0, passiv: 7.0 } },
  { id: 105, cat: "vodka-whisky", name: "Whisky – Glen Fiddich IPA", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 106, cat: "vodka-whisky", name: "Whisky – Wild Turkey Bourbon Rare 58.4%", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 107, cat: "vodka-whisky", name: "Cragganmore Whisky 12 Years", prices: { aktiv: 4.0, goenner: 6.0, passiv: 8.0 } },
  { id: 108, cat: "vodka-whisky", name: "Whisky – Oban 14 Years", prices: { aktiv: 4.5, goenner: 7.0, passiv: 9.0 } },
  { id: 109, cat: "vodka-whisky", name: "Whisky – Lagavulin 16 Years", prices: { aktiv: 5.0, goenner: 8.0, passiv: 10.0 } },
];
const ITEMS = RAW_ITEMS.map((i) => (i.prices ? i : { ...i, prices: tp(i.base) }));
const catalogWithPrices = (catalog) => catalog.map((i) => (i.prices ? i : { ...i, prices: tp(i.base) }));

const EQUIPMENT_CATEGORIES = [
  { id: "technik", label: "Licht & Ton" },
  { id: "bar", label: "Bar & Küche" },
  { id: "it", label: "IT & Netzwerk" },
  { id: "sonstiges", label: "Sonstiges" },
];

const DEFAULT_EQUIPMENT = [
  { id: 1, name: "Moving Heads (Bühne)", cat: "technik", task: "Linsen reinigen, Halterung prüfen", intervalDays: 30, lastDone: "2026-06-15", issues: [] },
  { id: 2, name: "Nebelmaschine", cat: "technik", task: "Flüssigkeit auffüllen, Düse reinigen", intervalDays: 14, lastDone: "2026-06-28", issues: [] },
  { id: 3, name: "Zapfanlage", cat: "bar", task: "Leitungen reinigen (Kobra)", intervalDays: 14, lastDone: "2026-06-25", issues: [] },
  { id: 4, name: "Kaffeemaschine", cat: "bar", task: "Entkalken", intervalDays: 60, lastDone: "2026-05-20", issues: [] },
  { id: 5, name: "Router (Vereinsheim)", cat: "it", task: "Neustart, Firmware prüfen", intervalDays: 90, lastDone: "2026-05-01", issues: [] },
  { id: 6, name: "Kassen-Tablet", cat: "it", task: "Updates einspielen, Akku prüfen", intervalDays: 30, lastDone: "2026-06-10", issues: [] },
];

const DEFAULT_MEMBERS = [];

const PAYMENT_METHODS = [
  { id: "bar", label: "Bar", icon: Banknote },
  { id: "twint", label: "TWINT", icon: Smartphone },
  { id: "debitor", label: "Debitor", icon: FileText },
];

const EVENT_TYPES = ["Veranstaltung", "Sitzung", "Arbeitseinsatz", "Schicht"];

const initialEvents = [
  { id: 1, isoDate: "2025-12-31", title: "Silvester mit Znacht", type: "Veranstaltung", time: "18:00–22:00", location: "Vereinsheim", published: true },
  { id: 2, isoDate: "2026-02-07", title: "Nachgeburtstag", type: "Veranstaltung", time: "22:00", location: "Vereinsheim", published: true },
  { id: 3, isoDate: "2026-03-21", title: "Stubete", type: "Veranstaltung", time: "22:00", location: "Vereinsheim", published: true },
  { id: 4, isoDate: "2026-04-05", title: "Eiersuechete", type: "Veranstaltung", time: "14:00–22:00", location: "Vereinsheim", published: true },
  { id: 5, isoDate: "2026-04-30", title: "Tanz in Mai", type: "Veranstaltung", time: "18:00–10:00", location: "Vereinsheim", published: true },
  { id: 6, isoDate: "2026-05-23", title: "Pfingst bringts", type: "Veranstaltung", time: "22:00", location: "Vereinsheim", published: true },
  { id: 7, isoDate: "2026-06-22", title: "Packi becho", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 8, isoDate: "2026-06-24", title: "Ordnung schaffen, demontagen, neue fenster einsetzen", type: "Arbeitseinsatz", time: "17:00–18:00", location: "Vereinsheim", published: true },
  { id: 9, isoDate: "2026-06-25", title: "Matrial transport", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 10, isoDate: "2026-06-26", title: "Durchbruch, KimaLager", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 11, isoDate: "2026-06-30", title: "Demontage, Duchbruch, Klima lager, Zuluft Abluft", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 12, isoDate: "2026-07-02", title: "Klimaanlage versetzen wans nicht so heiss ist", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 13, isoDate: "2026-07-17", title: "Lüftung montage, Stromer arbeiten", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 14, isoDate: "2026-07-24", title: "Bar zusammenbau", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 15, isoDate: "2026-07-27", title: "Monats Jornal versänden", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 16, isoDate: "2026-07-31", title: "Instandstellung, putzen, entsorgen, ect", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 17, isoDate: "2026-08-05", title: "Getränkelieferung", type: "Arbeitseinsatz", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 18, isoDate: "2026-08-07", title: "Tanzparade", type: "Veranstaltung", time: "22:00", location: "Vereinsheim", published: true },
  { id: 19, isoDate: "2026-08-18", title: "Sitzung", type: "Sitzung", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 20, isoDate: "2026-08-20", title: "Markus geburi", type: "Veranstaltung", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 21, isoDate: "2026-08-22", title: "One love day dance", type: "Veranstaltung", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 22, isoDate: "2026-08-29", title: "Limmatlauf", type: "Veranstaltung", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 23, isoDate: "2026-09-25", title: "GV Rümli", type: "Sitzung", time: "18:00–22:00", location: "Vereinsheim", published: true },
  { id: 24, isoDate: "2026-10-17", title: "Pan tau", type: "Veranstaltung", time: "09:00–10:00", location: "Vereinsheim", published: true },
  { id: 25, isoDate: "2026-10-24", title: "Speili namitag herbst party", type: "Veranstaltung", time: "09:00–10:00", location: "Vereinsheim", published: true },
];
const typeStyle = { Veranstaltung: colors.amber, Sitzung: colors.teal, Arbeitseinsatz: "#9C8CE8", Schicht: "#E8618C" };

const initialShifts = [
  { id: 1, isoDate: "2026-07-12", role: "Theke", time: "19:00–23:00", slots: 2, assigned: ["Lena Kramer"], published: true },
  { id: 2, isoDate: "2026-07-12", role: "Theke", time: "23:00–02:00", slots: 2, assigned: [], published: true },
  { id: 3, isoDate: "2026-07-20", role: "Auf-/Abbau", time: "10:00–13:00", slots: 3, assigned: [], published: true },
  { id: 4, isoDate: "2026-07-26", role: "Einlass", time: "21:30–00:00", slots: 1, assigned: ["Tom Reiner"], published: true },
  { id: 5, isoDate: "2026-07-26", role: "Theke", time: "22:00–02:00", slots: 2, assigned: [], published: true },
];

const initialDjPlan = [
  { id: 1, date: "Sa, 12. Jul", slot: "20:00–22:00", dj: "DJ Mara", genre: "Warm-up / House", published: true },
  { id: 2, date: "Sa, 12. Jul", slot: "22:00–01:00", dj: "DJ Kobra", genre: "Techno", published: true },
  { id: 3, date: "Sa, 26. Jul", slot: "22:00–00:00", dj: "DJ Mara", genre: "Retro / 80s-90s", published: true },
  { id: 4, date: "Sa, 26. Jul", slot: "00:00–02:00", dj: "Resident B2B", genre: "Electro", published: true },
];
const technikChecklist = ["Mischpult & 2 CDJs verkabelt", "Monitor-Boxen ausgerichtet", "Funkmikro getestet", "Nebelmaschine – Flüssigkeit prüfen", "Ersatzkabel im DJ-Case"];

const BAR_VORBEREITUNG = ["Kasse/Server eingeloggt", "Zapfanlage & Kühlschränke geprüft", "Wechselgeld gezählt", "Gläser/Becher bereitgestellt", "Eis besorgt", "Bar-Team eingeteilt"];
const BAR_SCHLUSS = ["Tagesabschluss durchgeführt", "Kasse gezählt & Differenz notiert", "Zapfanlage gereinigt", "Kühlschränke aufgefüllt für nächstes Mal", "Müll entsorgt", "Bar abgeschlossen"];

// ---------------------------------------------------------------
// Shared, synced storage
// ---------------------------------------------------------------
async function storageGet(key, fallback) {
  try {
    const res = await window.storage.get(key, true);
    return res ? JSON.parse(res.value) : fallback;
  } catch {
    return fallback;
  }
}
async function storageSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), true);
  } catch (e) {
    console.error("Sync-Fehler", key, e);
  }
}

// ---------------------------------------------------------------
// Kleine Bausteine
// ---------------------------------------------------------------
function Pill({ children, color }) {
  return <span style={{ ...body, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, color, background: `${color}1A`, border: `1px solid ${color}40`, borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>{children}</span>;
}
function SectionLabel({ children }) {
  return <div style={{ ...display, color: colors.textMuted, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}
function Card({ children, style }) {
  return <div style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 14, padding: 14, ...style }}>{children}</div>;
}
function TierBadge({ tier }) {
  const label = TIERS.find((t) => t.id === tier)?.label || tier;
  const c = tierColor[tier];
  return <span style={{ ...body, fontSize: 10.5, fontWeight: 700, color: c, background: `${c}1A`, border: `1px solid ${c}40`, borderRadius: 999, padding: "2px 8px" }}>{label}</span>;
}
function RoleBadge({ role, position }) {
  const c = role === "vorstand" || role === "admin" ? colors.amber : role === "dj" ? "#9C8CE8" : colors.teal;
  const label = position ? `${ROLE_META[role]?.label || role} · ${position}` : ROLE_META[role]?.label || role;
  return <span style={{ ...body, fontSize: 10, fontWeight: 700, color: c, background: `${c}1A`, border: `1px solid ${c}40`, borderRadius: 999, padding: "2px 8px", textTransform: "uppercase" }}>{label}</span>;
}

function ItemGrid({ tier, onAdd, customItems, catalog }) {
  const allCats = customItems?.length ? [...CATEGORIES, { id: "eigene", label: "Eigene", icon: FileText }] : CATEGORIES;
  const [cat, setCat] = useState(allCats[0].id);
  const items = cat === "eigene" ? customItems.map((c) => ({ id: `c${c.id}`, name: c.name, prices: tp(c.price) })) : (catalog || ITEMS).filter((i) => i.cat === cat && !i.hidden);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8, marginBottom: 16 }}>
        {allCats.map((c) => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              style={{
                ...body,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "12px 6px",
                borderRadius: 12,
                border: `1px solid ${active ? colors.amber : colors.hairline}`,
                background: active ? `${colors.amber}1A` : colors.surface,
                color: active ? colors.amber : colors.textMuted,
                fontSize: 11,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              <Icon size={18} />
              {c.label}
            </button>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {items.map((item) => {
          const outOfStock = item.stock !== undefined && item.stock <= 0;
          const lowStock = item.stock !== undefined && item.stock > 0 && item.stock <= 5;
          return (
            <button
              key={item.id}
              onClick={() => !outOfStock && onAdd(item)}
              disabled={outOfStock}
              style={{
                ...body,
                textAlign: "left",
                background: colors.surface,
                border: `1px solid ${outOfStock ? colors.danger + "60" : colors.hairline}`,
                borderRadius: 14,
                padding: 12,
                height: 92,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 4,
                opacity: outOfStock ? 0.5 : 1,
                cursor: outOfStock ? "not-allowed" : "pointer",
                transition: "transform .08s ease, border-color .08s ease",
              }}
              onPointerDown={(e) => { if (!outOfStock) e.currentTarget.style.transform = "scale(0.96)"; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onPointerLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span style={{
                color: colors.text, fontWeight: 600, fontSize: 12.5, lineHeight: 1.25,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>{item.name}</span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ ...display, color: tier ? tierColor[tier] : colors.amber, fontSize: 15 }}>
                  {tier ? chf(item.prices[tier]) : `ab ${chf(item.prices.aktiv)}`}
                </span>
                {outOfStock && <span style={{ ...body, color: colors.danger, fontSize: 9.5, fontWeight: 700 }}>LEER</span>}
                {lowStock && <span style={{ ...body, color: colors.amber, fontSize: 9.5, fontWeight: 700 }}>NUR {item.stock}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Preisstufe wählen (nach Antippen eines Artikels in der Kasse)
// ---------------------------------------------------------------
function TierPickerSheet({ item, onPick, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, background: colors.surface, borderRadius: "20px 20px 0 0", padding: "20px 18px calc(20px + env(safe-area-inset-bottom))", border: `1px solid ${colors.hairline}`, borderBottom: "none" }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: colors.hairline, margin: "0 auto 16px" }} />
        <div style={{ ...display, color: colors.text, fontSize: 17, marginBottom: 4 }}>{item.name}</div>
        <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 16 }}>Preisstufe für diesen Verkauf wählen</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              style={{
                ...body,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px", borderRadius: 14,
                border: `2px solid ${tierColor[t.id]}50`,
                background: `${tierColor[t.id]}14`,
                color: colors.text, fontSize: 15, fontWeight: 600,
              }}
            >
              <span>{t.label}</span>
              <span style={{ ...display, color: tierColor[t.id], fontSize: 17 }}>{chf(item.prices[t.id])}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ ...body, width: "100%", marginTop: 14, background: "transparent", border: "none", color: colors.textMuted, fontSize: 13, padding: "8px 0" }}>Abbrechen</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Checkout-Sheet: Bar / TWINT / Debitor
// ---------------------------------------------------------------
function CheckoutSheet({ total, onClose, onConfirm, forcedMember, members }) {
  const [method, setMethod] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(forcedMember || null);
  const [error, setError] = useState(null);
  const filtered = members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  const confirm = () => {
    if (!method) return;
    if (method === "debitor" && !selectedMember) { setError("Bitte Mitglied auswählen."); return; }
    onConfirm(method, selectedMember);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 40 }}>
      <div style={{ width: "100%", maxWidth: 460, background: colors.bg, borderTop: `1px solid ${colors.hairline}`, borderRadius: "20px 20px 0 0", maxHeight: "88vh", overflowY: "auto", padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: colors.textMuted, display: "flex" }}><ChevronLeft size={20} /></button>
          <div style={{ ...display, fontSize: 17 }}>Zahlung</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: `1px solid ${colors.hairline}`, borderBottom: `1px solid ${colors.hairline}`, marginBottom: 16 }}>
          <span style={{ ...body, color: colors.textMuted, fontSize: 13 }}>Total</span>
          <span style={{ ...display, fontSize: 26, color: colors.amber }}>{chf(total)}</span>
        </div>
        <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Zahlungsart</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;
            return (
              <button key={m.id} onClick={() => { setMethod(m.id); setError(null); }} style={{ ...body, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 4px", borderRadius: 12, border: `1px solid ${active ? colors.amber : colors.hairline}`, background: active ? `${colors.amber}1A` : colors.surface, color: active ? colors.amber : colors.textMuted, fontSize: 11.5, fontWeight: 600 }}>
                <Icon size={17} />{m.label}
              </button>
            );
          })}
        </div>
        {method === "debitor" && (
          <div style={{ marginBottom: 14 }}>
            {!selectedMember ? (
              <>
                <div style={{ position: "relative", marginBottom: 8 }}>
                  <Search size={14} color={colors.textMuted} style={{ position: "absolute", left: 12, top: 12 }} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mitglied suchen…" style={{ ...body, width: "100%", background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: "10px 14px 10px 34px", color: colors.text, fontSize: 13.5, outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {filtered.map((m) => (
                    <button key={m.id} onClick={() => setSelectedMember(m)} style={{ ...body, display: "flex", justifyContent: "space-between", alignItems: "center", background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{m.name} <TierBadge tier={m.type} /></span>
                      <span style={{ color: m.debitor > 0 ? colors.danger : colors.textMuted, ...display }}>{chf(m.debitor)}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 }}>{selectedMember.name} <TierBadge tier={selectedMember.type} /></div>
                  <div style={{ ...body, color: colors.textMuted, fontSize: 12 }}>Aktuell offen: {chf(selectedMember.debitor)}</div>
                </div>
                {!forcedMember && <button onClick={() => setSelectedMember(null)} style={{ background: "transparent", border: "none", color: colors.textMuted }}><X size={16} /></button>}
              </div>
            )}
          </div>
        )}
        {error && <div style={{ ...body, color: colors.danger, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
        <button onClick={confirm} disabled={!method} style={{ ...body, width: "100%", background: method ? colors.amber : colors.surfaceRaised, color: method ? "#1A1305" : colors.textMuted, fontWeight: 700, fontSize: 14.5, border: "none", borderRadius: 14, padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Check size={17} /> Zahlung abschliessen
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Kalender
// ---------------------------------------------------------------
function KalenderView({ events }) {
  const sorted = [...events].filter((e) => e.published !== false).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  const fmt = (isoDate) => {
    const d = new Date(isoDate + "T00:00:00");
    return {
      day: d.getDate(),
      month: d.toLocaleDateString("de-CH", { month: "short" }).replace(".", ""),
      weekday: d.toLocaleDateString("de-CH", { weekday: "short" }),
    };
  };
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel>Nächste Termine</SectionLabel>
      {sorted.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Termine erfasst</div></Card>}
      {sorted.map((e) => {
        const f = fmt(e.isoDate);
        return (
          <Card key={e.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ ...display, width: 52, textAlign: "center", color: colors.text, flexShrink: 0 }}>
              <div style={{ fontSize: 20, lineHeight: 1 }}>{f.day}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: "uppercase" }}>{f.month} · {f.weekday}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 15 }}>{e.title}</div>
              <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginTop: 2 }}>{e.time} · {e.location}</div>
            </div>
            <Pill color={typeStyle[e.type]}>{e.type}</Pill>
          </Card>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------
// Dienste
// ---------------------------------------------------------------
function DiensteView({ shifts, saveShifts, currentUser, showToast, availability, saveAvailability, swapRequests, saveSwapRequests, staff }) {
  const canEdit = ["vorstand", "admin"].includes(currentUser.role);
  const [tab, setTab] = useState("plan");

  const [sIsoDate, setSIsoDate] = useState(""); const [sRole, setSRole] = useState(""); const [sTime, setSTime] = useState(""); const [sSlots, setSSlots] = useState("2"); const [sEditId, setSEditId] = useState(null);
  const resetForm = () => { setSIsoDate(""); setSRole(""); setSTime(""); setSSlots("2"); setSEditId(null); };

  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("de-CH", { weekday: "short", day: "2-digit", month: "short" });
  };

  const saveShift = () => {
    if (!sIsoDate || !sRole.trim() || !sTime.trim()) return;
    const slots = Math.max(1, parseInt(sSlots, 10) || 1);
    if (sEditId) { saveShifts(shifts.map((s) => (s.id === sEditId ? { ...s, isoDate: sIsoDate, role: sRole, time: sTime, slots } : s))); showToast && showToast("Schicht aktualisiert"); }
    else { saveShifts([...shifts, { id: Date.now(), isoDate: sIsoDate, role: sRole, time: sTime, slots, assigned: [], published: false }]); showToast && showToast("Als Entwurf gespeichert"); }
    resetForm();
  };
  const editShift = (s) => { setSEditId(s.id); setSIsoDate(s.isoDate); setSRole(s.role); setSTime(s.time); setSSlots(String(s.slots || 1)); };
  const removeShift = (id) => { saveShifts(shifts.filter((s) => s.id !== id)); if (sEditId === id) resetForm(); };
  const togglePublish = (id) => {
    const entry = shifts.find((s) => s.id === id);
    saveShifts(shifts.map((s) => (s.id === id ? { ...s, published: !(s.published !== false) } : s)));
    showToast && showToast(entry && entry.published === false ? "Veröffentlicht" : "Zurück in Entwurf");
  };

  const toggleSignup = (id) => {
    saveShifts(shifts.map((s) => {
      if (s.id !== id) return s;
      const list = s.assigned || [];
      if (list.includes(currentUser.name)) return { ...s, assigned: list.filter((n) => n !== currentUser.name) };
      if (list.length >= (s.slots || 1)) { showToast && showToast("Schicht ist bereits voll"); return s; }
      return { ...s, assigned: [...list, currentUser.name] };
    }));
  };

  // --- Verfügbarkeit ---
  const myAvail = availability[currentUser.name] || [];
  const toggleAvail = (iso) => {
    const next = { ...availability };
    const list = next[currentUser.name] || [];
    next[currentUser.name] = list.includes(iso) ? list.filter((d) => d !== iso) : [...list, iso];
    saveAvailability(next);
  };
  const shiftDates = [...new Set(shifts.filter((s) => s.published !== false).map((s) => s.isoDate))].sort();

  // --- Tauschen ---
  const requestSwap = (shiftId) => {
    if (swapRequests.some((r) => r.shiftId === shiftId && r.from === currentUser.name && !r.takenBy)) { showToast && showToast("Tausch bereits angefragt"); return; }
    saveSwapRequests([...swapRequests, { id: Date.now(), shiftId, from: currentUser.name, takenBy: null, date: new Date().toLocaleDateString("de-CH") }]);
    showToast && showToast("Tausch angefragt — sichtbar für alle");
  };
  const acceptSwap = (req) => {
    const shift = shifts.find((s) => s.id === req.shiftId);
    if (!shift) return;
    saveShifts(shifts.map((s) => (s.id === req.shiftId ? { ...s, assigned: [...(s.assigned || []).filter((n) => n !== req.from), currentUser.name] } : s)));
    saveSwapRequests(swapRequests.map((r) => (r.id === req.id ? { ...r, takenBy: currentUser.name } : r)));
    showToast && showToast("Schicht übernommen");
  };
  const cancelSwap = (id) => saveSwapRequests(swapRequests.filter((r) => r.id !== id));
  const openSwaps = swapRequests.filter((r) => !r.takenBy);

  const visible = (canEdit ? shifts : shifts.filter((s) => s.published !== false)).sort((a, b) => (a.isoDate || "").localeCompare(b.isoDate || ""));

  const TabButton = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ ...body, flex: 1, padding: "9px 0", borderRadius: 10, border: `1px solid ${tab === id ? colors.amber : colors.hairline}`, background: tab === id ? `${colors.amber}1A` : colors.surface, color: tab === id ? colors.amber : colors.textMuted, fontSize: 12.5, fontWeight: 700 }}>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-5">
      <div style={{ display: "flex", gap: 8 }}>
        <TabButton id="plan" label="Schichtplan" />
        <TabButton id="verfuegbar" label="Verfügbarkeit" />
        <TabButton id="tausch" label={`Tauschen${openSwaps.length ? ` (${openSwaps.length})` : ""}`} />
      </div>

      {tab === "plan" && (
        <>
          {canEdit && (
            <div>
              <SectionLabel>Schicht planen</SectionLabel>
              <Card>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input type="date" value={sIsoDate} onChange={(e) => setSIsoDate(e.target.value)} style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
                  <input value={sTime} onChange={(e) => setSTime(e.target.value)} placeholder="Zeit (19:00–23:00)" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input value={sRole} onChange={(e) => setSRole(e.target.value)} placeholder="Aufgabe (Theke, Einlass …)" style={{ ...body, flex: 2, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
                  <input value={sSlots} onChange={(e) => setSSlots(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Personen" inputMode="numeric" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={saveShift} style={{ ...body, flex: 1, background: colors.teal, color: "#0B2E28", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "9px 0" }}>{sEditId ? "Speichern" : "Schicht anlegen"}</button>
                  {sEditId && <button onClick={resetForm} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "9px 14px" }}>Abbrechen</button>}
                </div>
              </Card>
            </div>
          )}

          <div>
            <SectionLabel>Schichten</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {visible.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Schichten veröffentlicht</div></Card>}
              {visible.map((s) => {
                const isDraft = s.published === false;
                const list = s.assigned || [];
                const slots = s.slots || 1;
                const full = list.length >= slots;
                const iAmIn = list.includes(currentUser.name);
                const availableFor = Object.entries(availability).filter(([name, dates]) => dates.includes(s.isoDate) && !list.includes(name)).map(([name]) => name);
                return (
                  <Card key={s.id} style={{ opacity: isDraft ? 0.65 : 1, border: `1px solid ${isDraft ? colors.amber + "40" : colors.hairline}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          {s.role} · {s.time}
                          {isDraft && <span style={{ ...body, fontSize: 9.5, fontWeight: 700, color: colors.amber, background: `${colors.amber}1A`, border: `1px solid ${colors.amber}40`, borderRadius: 999, padding: "1px 7px" }}>ENTWURF</span>}
                        </div>
                        <div style={{ ...body, color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{fmtDate(s.isoDate)}</div>
                        <div style={{ ...body, fontSize: 12, marginTop: 4, color: full ? colors.teal : colors.danger }}>
                          {list.length}/{slots} besetzt{list.length ? ` — ${list.join(", ")}` : ""}
                        </div>
                        {canEdit && availableFor.length > 0 && (
                          <div style={{ ...body, fontSize: 11, marginTop: 3, color: colors.teal }}>Verfügbar: {availableFor.join(", ")}</div>
                        )}
                      </div>
                      {!isDraft && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                          <button onClick={() => toggleSignup(s.id)} disabled={!iAmIn && full} style={{ ...body, fontSize: 12, fontWeight: 600, border: `1px solid ${iAmIn ? colors.danger : full ? colors.hairline : colors.amber}`, color: iAmIn ? colors.danger : full ? colors.textMuted : colors.amber, background: "transparent", borderRadius: 10, padding: "6px 10px", opacity: !iAmIn && full ? 0.5 : 1 }}>
                            {iAmIn ? "Abmelden" : full ? "Voll" : "Eintragen"}
                          </button>
                          {iAmIn && (
                            <button onClick={() => requestSwap(s.id)} style={{ ...body, fontSize: 11.5, fontWeight: 600, border: `1px solid ${colors.teal}60`, color: colors.teal, background: "transparent", borderRadius: 10, padding: "5px 10px" }}>
                              Tausch suchen
                            </button>
                          )}
                        </div>
                      )}
                      {canEdit && (
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button onClick={() => togglePublish(s.id)} style={{ background: isDraft ? `${colors.amber}1A` : colors.surfaceRaised, border: `1px solid ${isDraft ? colors.amber + "60" : colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: isDraft ? colors.amber : colors.textMuted }}>
                            {isDraft ? <Send size={13} /> : <Check size={13} />}
                          </button>
                          <button onClick={() => editShift(s)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal }}><Pencil size={13} /></button>
                          <button onClick={() => removeShift(s.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger }}><Trash2 size={13} /></button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {tab === "verfuegbar" && (
        <div>
          <SectionLabel>Meine Verfügbarkeit</SectionLabel>
          <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
            Tage antippen, an denen du grundsätzlich Zeit hättest. Der Vorstand sieht das beim Planen der Schichten.
          </div>
          {shiftDates.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Termine mit Schichten</div></Card>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shiftDates.map((iso) => {
              const active = myAvail.includes(iso);
              return (
                <Card key={iso} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${active ? colors.teal + "60" : colors.hairline}` }}>
                  <CalendarDays size={16} color={active ? colors.teal : colors.textMuted} />
                  <span style={{ ...body, flex: 1, color: colors.text, fontSize: 13.5, fontWeight: 600 }}>{fmtDate(iso)}</span>
                  <button onClick={() => toggleAvail(iso)} style={{ width: 46, height: 27, borderRadius: 999, border: `1px solid ${colors.hairline}`, background: active ? colors.teal : colors.surfaceRaised, position: "relative", flexShrink: 0 }}>
                    <span style={{ position: "absolute", top: 2, left: active ? 22 : 2, width: 21, height: 21, borderRadius: "50%", background: colors.text, transition: "left .2s" }} />
                  </button>
                </Card>
              );
            })}
          </div>

          {canEdit && (
            <div style={{ marginTop: 22 }}>
              <SectionLabel>Wer ist wann verfügbar</SectionLabel>
              {Object.keys(availability).length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Rückmeldungen</div></Card>}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(availability).sort((a, b) => a[0].localeCompare(b[0], "de")).map(([name, dates]) => (
                  <Card key={name}>
                    <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{name}</div>
                    <div style={{ ...body, color: colors.textMuted, fontSize: 12 }}>{dates.length ? dates.sort().map(fmtDate).join(" · ") : "keine Angaben"}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "tausch" && (
        <div>
          <SectionLabel>Tauschbörse</SectionLabel>
          <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
            Wer eine Schicht abgeben möchte, stellt sie hier ein. Andere können sie direkt übernehmen.
          </div>
          {openSwaps.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Keine offenen Tauschanfragen</div></Card>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {openSwaps.map((r) => {
              const s = shifts.find((x) => x.id === r.shiftId);
              if (!s) return null;
              const mine = r.from === currentUser.name;
              return (
                <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${colors.teal}40` }}>
                  <ArrowLeftRight size={16} color={colors.teal} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{s.role} · {s.time}</div>
                    <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{fmtDate(s.isoDate)} · abgegeben von {r.from}</div>
                  </div>
                  {mine ? (
                    <button onClick={() => cancelSwap(r.id)} style={{ ...body, fontSize: 11.5, fontWeight: 700, color: colors.danger, background: "transparent", border: `1px solid ${colors.danger}40`, borderRadius: 8, padding: "6px 10px" }}>Zurückziehen</button>
                  ) : (
                    <button onClick={() => acceptSwap(r)} style={{ ...body, fontSize: 11.5, fontWeight: 700, color: "#0B2E28", background: colors.teal, border: "none", borderRadius: 8, padding: "6px 12px" }}>Übernehmen</button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------
// DJ
// ---------------------------------------------------------------
function DJView({ mixes, saveMixes, currentUser, showToast, djPlan, saveDjPlan }) {
  const [checked, setChecked] = useState({});
  const [mixTitle, setMixTitle] = useState(""); const [mixUrl, setMixUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const canEditLineup = ["dj", "vorstand", "admin"].includes(currentUser.role);

  const [lpDate, setLpDate] = useState(""); const [lpSlot, setLpSlot] = useState(""); const [lpDj, setLpDj] = useState(""); const [lpGenre, setLpGenre] = useState(""); const [lpEditId, setLpEditId] = useState(null);
  const resetLp = () => { setLpDate(""); setLpSlot(""); setLpDj(""); setLpGenre(""); setLpEditId(null); };
  const saveLp = () => {
    if (!lpDate.trim() || !lpSlot.trim() || !lpDj.trim()) return;
    if (lpEditId) { saveDjPlan(djPlan.map((p) => (p.id === lpEditId ? { ...p, date: lpDate, slot: lpSlot, dj: lpDj, genre: lpGenre } : p))); showToast && showToast("Lineup aktualisiert"); }
    else { saveDjPlan([...djPlan, { id: Date.now(), date: lpDate, slot: lpSlot, dj: lpDj, genre: lpGenre, published: false }]); showToast && showToast("Als Entwurf gespeichert"); }
    resetLp();
  };
  const editLp = (p) => { setLpEditId(p.id); setLpDate(p.date); setLpSlot(p.slot); setLpDj(p.dj); setLpGenre(p.genre); };
  const removeLp = (id) => { saveDjPlan(djPlan.filter((p) => p.id !== id)); if (lpEditId === id) resetLp(); };
  const togglePublish = (id) => {
    saveDjPlan(djPlan.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
    const entry = djPlan.find((p) => p.id === id);
    showToast && showToast(entry && !entry.published ? "Veröffentlicht" : "Zurück in Entwurf");
  };

  const addMix = () => {
    if (!mixTitle.trim() || !mixUrl.trim()) return;
    saveMixes([{ id: Date.now(), title: mixTitle.trim(), url: mixUrl.trim(), dj: currentUser.name, date: new Date().toLocaleDateString("de-CH") }, ...mixes]);
    setMixTitle(""); setMixUrl("");
  };
  const removeMix = (id) => saveMixes(mixes.filter((m) => m.id !== id));

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/mixes/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload fehlgeschlagen");
      const data = await res.json();
      saveMixes([{ id: Date.now(), title: mixTitle.trim() || file.name, url: data.url, dj: currentUser.name, date: new Date().toLocaleDateString("de-CH"), local: true }, ...mixes]);
      setMixTitle("");
      showToast && showToast("Mix hochgeladen");
    } catch (e) {
      showToast && showToast("Upload nur auf dem eigenen Server möglich (nicht in dieser Vorschau)");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <SectionLabel>DJ-Plan</SectionLabel>
        {canEditLineup && (
          <Card style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={lpDate} onChange={(e) => setLpDate(e.target.value)} placeholder="Datum (z. B. Sa, 12. Jul)" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
              <input value={lpSlot} onChange={(e) => setLpSlot(e.target.value)} placeholder="Zeit (20:00–22:00)" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={lpDj} onChange={(e) => setLpDj(e.target.value)} placeholder="DJ-Name" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
              <input value={lpGenre} onChange={(e) => setLpGenre(e.target.value)} placeholder="Genre" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveLp} style={{ ...body, flex: 1, background: colors.teal, color: "#0B2E28", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "9px 0" }}>{lpEditId ? "Speichern" : "Zum Lineup hinzufügen"}</button>
              {lpEditId && <button onClick={resetLp} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "9px 14px" }}>Abbrechen</button>}
            </div>
          </Card>
        )}
        <div className="flex flex-col gap-2.5">
          {djPlan.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch kein Lineup erfasst</div></Card>}
          {(canEditLineup ? djPlan : djPlan.filter((p) => p.published)).map((p) => (
            <Card key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, opacity: !p.published && canEditLineup ? 0.65 : 1, border: `1px solid ${!p.published && canEditLineup ? colors.amber + "40" : colors.hairline}` }}>
              <ListMusic size={18} color={colors.teal} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  {p.dj}
                  {!p.published && canEditLineup && <span style={{ ...body, fontSize: 9.5, fontWeight: 700, color: colors.amber, background: `${colors.amber}1A`, border: `1px solid ${colors.amber}40`, borderRadius: 999, padding: "1px 7px" }}>ENTWURF</span>}
                </div>
                <div style={{ ...body, color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{p.date} · {p.slot}</div>
              </div>
              <Pill color={colors.teal}>{p.genre}</Pill>
              {canEditLineup && (
                <>
                  <button onClick={() => togglePublish(p.id)} style={{ background: p.published ? colors.surfaceRaised : `${colors.amber}1A`, border: `1px solid ${p.published ? colors.hairline : colors.amber + "60"}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: p.published ? colors.textMuted : colors.amber, flexShrink: 0 }} title={p.published ? "Zurückziehen" : "Veröffentlichen"}>
                    {p.published ? <Check size={13} /> : <Send size={13} />}
                  </button>
                  <button onClick={() => editLp(p)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal, flexShrink: 0 }}><Pencil size={13} /></button>
                  <button onClick={() => removeLp(p.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger, flexShrink: 0 }}><Trash2 size={13} /></button>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
      <div>
        <SectionLabel>Mixe &amp; Aufnahmen</SectionLabel>
        <Card style={{ marginBottom: 10 }}>
          <input value={mixTitle} onChange={(e) => setMixTitle(e.target.value)} placeholder="Titel (z. B. Clubnacht Juli Live-Set)" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />

          <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Von unserem Server hochladen</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => uploadFile(e.target.files[0])}
            style={{ display: "none" }}
            id="mix-file-input"
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
            style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.teal}40`, color: colors.teal, fontWeight: 700, fontSize: 13, borderRadius: 10, padding: "10px 0", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Download size={14} style={{ transform: "rotate(180deg)" }} /> {uploading ? "Lädt hoch…" : "Audiodatei auswählen & hochladen"}
          </button>

          <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Oder Link einfügen</div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Link2 size={14} color={colors.textMuted} style={{ position: "absolute", left: 12, top: 12 }} />
            <input value={mixUrl} onChange={(e) => setMixUrl(e.target.value)} placeholder="Link (SoundCloud, Mixcloud, Drive …)" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px 10px 34px", color: colors.text, fontSize: 13.5, outline: "none" }} />
          </div>
          <button onClick={addMix} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>Link hinzufügen</button>
        </Card>
        <div className="flex flex-col gap-2">
          {mixes.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Mixe hochgeladen</div></Card>}
          {[...mixes].sort((a, b) => a.title.localeCompare(b.title, "de")).map((m) => (
            <Card key={m.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Volume2 size={16} color={colors.teal} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {m.local ? (
                    <span style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{m.title}</span>
                  ) : (
                    <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, textDecoration: "none" }}>{m.title}</a>
                  )}
                  <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{m.dj} · {m.date}{m.local ? " · Server" : ""}</div>
                </div>
                <button onClick={() => removeMix(m.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger, flexShrink: 0 }}><Trash2 size={13} /></button>
              </div>
              {m.local && (
                <audio controls src={m.url} style={{ width: "100%", marginTop: 10, height: 34 }} />
              )}
            </Card>
          ))}
        </div>
      </div>
      <div>
        <SectionLabel>Technik-Check</SectionLabel>
        <Card>
          {technikChecklist.map((item, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px", borderBottom: i < technikChecklist.length - 1 ? `1px solid ${colors.hairline}` : "none", cursor: "pointer" }}>
              <input type="checkbox" checked={!!checked[i]} onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} style={{ width: 16, height: 16, accentColor: colors.teal }} />
              <span style={{ ...body, fontSize: 13.5, color: checked[i] ? colors.textMuted : colors.text, textDecoration: checked[i] ? "line-through" : "none" }}>{item}</span>
            </label>
          ))}
        </Card>
      </div>
      <div>
        <SectionLabel>Aufbau-Infos</SectionLabel>
        <Card>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Wrench size={16} color={colors.amber} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ ...body, color: colors.text, fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>
              Aufbau ab 18:00 Uhr. Pult steht auf der Bühne links, Lautsprecher bitte auf den Markierungen am Boden ausrichten. Schlüssel für den Technikraum liegt an der Bar.
            </p>
          </div>
        </Card>
      </div>
      <div>
        <SectionLabel>Playlists</SectionLabel>
        <Card style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Volume2 size={16} color={colors.teal} />
          <span style={{ ...body, color: colors.text, fontSize: 13.5 }}>Geteilte Playlist „Warm-up Sommer 2026" – 3 Mitwirkende</span>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Kasse (Direktverkauf)
// ---------------------------------------------------------------
function KasseView({ members, saveMembers, sales, saveSales, showToast, currentUser, customBelege, catalog, consumeStock, readOnlyFor }) {
  const [subTab, setSubTab] = useState("verkauf");
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [vorbereitungChecked, setVorbereitungChecked] = useState({});
  const [schlussChecked, setSchlussChecked] = useState({});
  const [pendingItem, setPendingItem] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [pickerFor, setPickerFor] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const addItem = (item, tierId) => {
    const price = item.prices[tierId];
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.tier === tierId);
      if (existing) return prev.map((i) => (i.id === item.id && i.tier === tierId ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: item.id, name: item.name, price, qty: 1, tier: tierId }];
    });
    setPendingItem(null);
  };
  const changeQty = (id, tierId, delta) => setCart((prev) => prev.map((i) => (i.id === id && i.tier === tierId ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  const clearCart = () => { setCart([]); setCheckoutOpen(false); };

  const handleConfirm = (method, member) => {
    if (method === "debitor" && member) saveMembers(members.map((m) => (m.id === member.id ? { ...m, debitor: +(m.debitor + total).toFixed(2) } : m)));
    const itemsLabel = cart.map((i) => `${i.qty}x ${i.name}`).join(", ");
    saveSales([{ id: Date.now(), total, method, staff: currentUser.name, time: now(), member: method === "debitor" ? member.name : null, items: itemsLabel }, ...sales]);
    consumeStock && consumeStock(cart.map((i) => ({ id: i.id, qty: i.qty })));
    showToast(`Verkauft für ${chf(total)}`);
    clearCart();
  };

  const chargeToMember = (memberId, item) => {
    const member = members.find((m) => m.id === memberId);
    const price = item.prices[member.type];
    saveMembers(members.map((m) => (m.id === memberId ? { ...m, debitor: +(m.debitor + price).toFixed(2) } : m)));
    saveSales([{ id: Date.now(), total: price, method: "debitor", staff: currentUser.name, time: now(), member: member.name, items: item.name }, ...sales]);
    consumeStock && consumeStock([{ id: item.id, qty: 1 }]);
    showToast(`${item.name} auf Debitor von ${member.name}`);
  };
  const registerPayment = (memberId) => {
    const val = parseFloat(payAmount.replace(",", "."));
    if (!val || val <= 0) return;
    saveMembers(members.map((m) => (m.id === memberId ? { ...m, debitor: +(m.debitor - val).toFixed(2), payHistory: [{ amount: val, date: now() }, ...m.payHistory] } : m)));
    showToast(`Zahlung erfasst: ${chf(val)}`);
    setPayAmount("");
  };

  if (readOnlyFor) {
    const me = members.find((m) => m.name === readOnlyFor);
    if (!me) {
      return (
        <div className="flex flex-col gap-5">
          <Card style={{ textAlign: "center", padding: "26px 16px" }}>
            <div style={{ ...body, color: colors.textMuted, fontSize: 13 }}>Noch kein Debitorenkonto für dich angelegt.</div>
            <div style={{ ...body, color: colors.textMuted, fontSize: 12, marginTop: 6 }}>Der Vorstand kann das unter „Kasse → Debitoren" einrichten.</div>
          </Card>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-5">
        <Card style={{ background: `linear-gradient(135deg, ${colors.surfaceRaised}, ${colors.surface})`, textAlign: "center", padding: "26px 16px" }}>
          <div style={{ ...body, color: me.debitor > 0 ? colors.danger : colors.teal, fontSize: 12 }}>{me.debitor > 0 ? "Dein offener Betrag" : me.debitor < 0 ? "Dein Guthaben" : "Ausgeglichen"}</div>
          <div style={{ ...display, color: me.debitor > 0 ? colors.danger : colors.teal, fontSize: 40, marginTop: 4 }}>{chf(Math.abs(me.debitor))}</div>
          <div style={{ ...body, color: colors.textMuted, fontSize: 12, marginTop: 8 }}>{me.debitor > 0 ? "Ausgleich bitte bar oder per TWINT an der Theke" : me.debitor < 0 ? "Wird automatisch mit deinem nächsten Konsum verrechnet" : "Nichts offen"}</div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setSubTab("verkauf")} style={{ ...body, flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${subTab === "verkauf" ? colors.amber : colors.hairline}`, background: subTab === "verkauf" ? `${colors.amber}1A` : colors.surface, color: subTab === "verkauf" ? colors.amber : colors.textMuted, fontSize: 13.5, fontWeight: 700 }}>Verkauf</button>
        <button onClick={() => setSubTab("debitoren")} style={{ ...body, flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${subTab === "debitoren" ? colors.amber : colors.hairline}`, background: subTab === "debitoren" ? `${colors.amber}1A` : colors.surface, color: subTab === "debitoren" ? colors.amber : colors.textMuted, fontSize: 13.5, fontWeight: 700 }}>Debitoren</button>
      </div>

      {subTab === "verkauf" && (
        <>
          <Card style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}>
            <button onClick={() => setInfoOpen(!infoOpen)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: 14, background: "transparent", border: "none" }}>
              <ClipboardList size={17} color={colors.teal} />
              <span style={{ ...body, flex: 1, textAlign: "left", color: colors.text, fontWeight: 700, fontSize: 13.5 }}>Bar-Infos: Login, Vorbereitung &amp; Schlussarbeiten</span>
              <ChevronDown size={15} color={colors.textMuted} style={{ transform: infoOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
            </button>
            {infoOpen && (
              <div style={{ padding: "0 14px 16px" }}>
                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Login auf jedem Gerät</div>
                <div style={{ ...body, color: colors.text, fontSize: 12.5, lineHeight: 1.6, marginBottom: 16 }}>
                  1. Browser öffnen (egal ob Handy, Tablet, PC)<br />
                  2. Im Heim-WLAN: Server-Adresse eingeben · von unterwegs: Tailscale-Adresse<br />
                  3. Eigenen 4-stelligen Code eingeben<br />
                  4. Fertig — für Home-Bildschirm: Teilen-Symbol → „Zum Home-Bildschirm"
                </div>

                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Vorbereitung (vor dem Öffnen)</div>
                <div style={{ marginBottom: 16 }}>
                  {BAR_VORBEREITUNG.map((item, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer" }}>
                      <input type="checkbox" checked={!!vorbereitungChecked[i]} onChange={() => setVorbereitungChecked((c) => ({ ...c, [i]: !c[i] }))} style={{ width: 15, height: 15, accentColor: colors.teal }} />
                      <span style={{ ...body, fontSize: 12.5, color: vorbereitungChecked[i] ? colors.textMuted : colors.text, textDecoration: vorbereitungChecked[i] ? "line-through" : "none" }}>{item}</span>
                    </label>
                  ))}
                </div>

                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Schlussarbeiten</div>
                <div>
                  {BAR_SCHLUSS.map((item, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer" }}>
                      <input type="checkbox" checked={!!schlussChecked[i]} onChange={() => setSchlussChecked((c) => ({ ...c, [i]: !c[i] }))} style={{ width: 15, height: 15, accentColor: colors.amber }} />
                      <span style={{ ...body, fontSize: 12.5, color: schlussChecked[i] ? colors.textMuted : colors.text, textDecoration: schlussChecked[i] ? "line-through" : "none" }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <ItemGrid onAdd={(item) => setPendingItem(item)} customItems={customBelege} catalog={catalog} />
          {pendingItem && (
            <TierPickerSheet item={pendingItem} onPick={(tierId) => addItem(pendingItem, tierId)} onClose={() => setPendingItem(null)} />
          )}
          {cart.length > 0 && (
            <button onClick={() => setCheckoutOpen(true)} style={{ position: "fixed", bottom: 66, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 428, background: colors.amber, color: "#1A1305", border: "none", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 14px 30px rgba(0,0,0,0.4)", zIndex: 15 }}>
              <span style={{ ...body, fontWeight: 700, fontSize: 14 }}>{cart.reduce((s, i) => s + i.qty, 0)} Artikel · zur Kasse</span>
              <span style={{ ...display, fontSize: 17 }}>{chf(total)}</span>
            </button>
          )}
          {checkoutOpen && <CheckoutSheet total={total} members={members} onClose={() => setCheckoutOpen(false)} onConfirm={handleConfirm} />}
        </>
      )}

      {subTab === "debitoren" && (
        <>
          <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
            Konsum wird auf das Konto gebucht (Preis nach Stufe). Mitglieder können jederzeit Guthaben aufladen (bar/TWINT an der Theke) — das wird automatisch mit offenen und künftigen Beträgen verrechnet.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...members].sort((a, b) => a.name.localeCompare(b.name, "de")).map((m) => {
              const open = openId === m.id;
              return (
                <div key={m.id} style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 14, overflow: "hidden" }}>
                  <button onClick={() => setOpenId(open ? null : m.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 14, background: "transparent", border: "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: colors.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "center", ...display, color: colors.amber, fontSize: 14, flexShrink: 0 }}>{m.name[0]}</div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>{m.name} <TierBadge tier={m.type} /></div>
                      <div style={{ ...body, color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{m.debitor > 0 ? "offener Betrag" : m.debitor < 0 ? "Guthaben vorhanden" : "ausgeglichen"}</div>
                    </div>
                    <div style={{ ...display, fontSize: 17, color: m.debitor > 0 ? colors.danger : colors.teal }}>{chf(Math.abs(m.debitor))}</div>
                    <ChevronDown size={15} color={colors.textMuted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                  </button>
                  {open && (
                    <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${colors.hairline}` }}>
                      <button onClick={() => setPickerFor(pickerFor === m.id ? null : m.id)} style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 0", color: colors.teal, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, marginBottom: 10 }}>
                        <Plus size={14} /> Konsum hinzufügen
                      </button>
                      {pickerFor === m.id && <div style={{ marginBottom: 14 }}><ItemGrid tier={m.type} onAdd={(item) => chargeToMember(m.id, item)} customItems={customBelege} catalog={catalog} /></div>}
                      <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Aufladen / Zahlung erfassen</div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        {[20, 40, 50, 100].map((amt) => (
                          <button key={amt} onClick={() => setPayAmount(String(amt))} style={{ ...body, flex: 1, padding: "7px 0", borderRadius: 8, border: `1px solid ${payAmount === String(amt) ? colors.teal : colors.hairline}`, background: payAmount === String(amt) ? `${colors.teal}1A` : colors.surfaceRaised, color: payAmount === String(amt) ? colors.teal : colors.textMuted, fontSize: 12, fontWeight: 700 }}>
                            {amt}.-
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Betrag" inputMode="decimal" style={{ ...body, width: 90, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13.5, outline: "none" }} />
                        <button onClick={() => registerPayment(m.id)} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10 }}>Bar/TWINT erhalten</button>
                      </div>
                      <div style={{ ...body, color: colors.textMuted, fontSize: 11, marginTop: 8, lineHeight: 1.4 }}>
                        Zahlt jemand mehr als sein offener Betrag, wird der Rest automatisch als Guthaben gutgeschrieben und bei zukünftigem Konsum zuerst verrechnet.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}


// ---------------------------------------------------------------
// Tagesabschluss
// ---------------------------------------------------------------
function TagesabschlussView({ sales, saveSales, showToast, members, onArchive }) {
  const [eventName, setEventName] = useState("Party");
  const byMethod = useMemo(() => { const m = { bar: 0, twint: 0, debitor: 0 }; sales.forEach((s) => { m[s.method] = (m[s.method] || 0) + s.total; }); return m; }, [sales]);
  const total = byMethod.bar + byMethod.twint + byMethod.debitor;
  const debitorEntries = useMemo(() => sales.filter((s) => s.method === "debitor"), [sales]);
  const debitorTotals = useMemo(() => { const per = {}; debitorEntries.forEach((s) => { per[s.member] = (per[s.member] || 0) + s.total; }); return Object.entries(per); }, [debitorEntries]);
  const outstandingBalances = useMemo(() => members.filter((m) => m.debitor > 0), [members]);

  const exportCsv = () => {
    const lines = ["Zeit;Name;Artikel;Betrag CHF"];
    debitorEntries.forEach((s) => lines.push(`${s.time};${s.member};${s.items || ""};${s.total.toFixed(2)}`));
    lines.push(""); lines.push("Mitglied;Total dieser Session CHF");
    debitorTotals.forEach(([name, amt]) => lines.push(`${name};${amt.toFixed(2)}`));
    lines.push(""); lines.push("Mitglied;Gesamt offen (kumuliert) CHF");
    outstandingBalances.forEach((m) => lines.push(`${m.name};${m.debitor.toFixed(2)}`));
    lines.push(""); lines.push(`Total Bar;${byMethod.bar.toFixed(2)}`); lines.push(`Total TWINT;${byMethod.twint.toFixed(2)}`); lines.push(`Total Debitor;${byMethod.debitor.toFixed(2)}`);
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toLocaleDateString("de-CH").replace(/\./g, "-");
    a.href = url; a.download = `Tagesabschluss_${eventName.replace(/\s+/g, "_")}_${dateStr}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("Export für Numbers erstellt");
  };
  const closeDay = () => {
    exportCsv();
    onArchive({ id: Date.now(), date: new Date().toISOString(), eventName, total, bar: byMethod.bar, twint: byMethod.twint, debitor: byMethod.debitor });
    saveSales([]);
    showToast("Tagesabschluss zurückgesetzt");
  };

  return (
    <div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Anlass</div>
        <input value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 14, outline: "none", marginBottom: 16 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {[["Bar", byMethod.bar], ["TWINT", byMethod.twint], ["Debitor", byMethod.debitor]].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ ...body, color: colors.textMuted, fontSize: 13 }}>{label}</span><span style={{ ...display, color: colors.text, fontSize: 15 }}>{chf(val)}</span></div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${colors.hairline}` }}>
          <span style={{ ...body, color: colors.text, fontWeight: 700, fontSize: 14 }}>Total</span><span style={{ ...display, color: colors.amber, fontSize: 20 }}>{chf(total)}</span>
        </div>
      </div>
      {debitorEntries.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Offene Belege dieser Session</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {debitorEntries.map((s) => (
              <div key={s.id} style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13 }}>{s.member}</div>
                  <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{s.items || "—"} · {s.time}</div>
                </div>
                <div style={{ ...display, color: colors.danger, fontSize: 14 }}>{chf(s.total)}</div>
              </div>
            ))}
          </div>
          <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 0 8px" }}>Total pro Mitglied (diese Session)</div>
          {debitorTotals.map(([name, amt]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", ...body, fontSize: 13 }}><span style={{ color: colors.text, fontWeight: 600 }}>{name}</span><span style={{ color: colors.danger }}>{chf(amt)}</span></div>
          ))}
        </div>
      )}
      {outstandingBalances.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Gesamt offen pro Mitglied (kumuliert)</div>
          {outstandingBalances.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", ...body, fontSize: 13 }}><span style={{ color: colors.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>{m.name} <TierBadge tier={m.type} /></span><span style={{ color: colors.danger, ...display }}>{chf(m.debitor)}</span></div>
          ))}
        </div>
      )}
      <button onClick={exportCsv} style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, color: colors.teal, fontWeight: 700, fontSize: 13.5, borderRadius: 12, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
        <Download size={15} /> Nur exportieren (für Numbers)
      </button>
      <button onClick={closeDay} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 14, borderRadius: 12, padding: "13px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none" }}>
        <PartyPopper size={16} /> Tagesabschluss & Session zurücksetzen
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// Eigene Belege verwalten
// ---------------------------------------------------------------
function BelegeVerwaltenView({ customBelege, saveCustomBelege, showToast }) {
  const [name, setName] = useState(""); const [price, setPrice] = useState(""); const [editId, setEditId] = useState(null);
  const reset = () => { setName(""); setPrice(""); setEditId(null); };
  const save = () => {
    const p = parseFloat(price.replace(",", "."));
    if (!name.trim() || !p) return;
    if (editId) { saveCustomBelege(customBelege.map((b) => (b.id === editId ? { ...b, name, price: p } : b))); showToast("Beleg aktualisiert"); }
    else { saveCustomBelege([...customBelege, { id: Date.now(), name, price: p }]); showToast("Beleg erstellt"); }
    reset();
  };
  const edit = (b) => { setEditId(b.id); setName(b.name); setPrice(String(b.price)); };
  const remove = (id) => { saveCustomBelege(customBelege.filter((b) => b.id !== id)); if (editId === id) reset(); };
  return (
    <div>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>Eigene Belege erscheinen in der Kasse unter „Eigene".</div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bezeichnung" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Betrag CHF" inputMode="decimal" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>{editId ? "Speichern" : "Beleg erstellen"}</button>
          {editId && <button onClick={reset} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "10px 16px" }}>Abbrechen</button>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...customBelege].sort((a, b) => a.name.localeCompare(b.name, "de")).map((b) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: 12 }}>
            <div style={{ flex: 1 }}><div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{b.name}</div><div style={{ ...display, color: colors.amber, fontSize: 13 }}>{chf(b.price)}</div></div>
            <button onClick={() => edit(b)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal }}><Pencil size={13} /></button>
            <button onClick={() => remove(b.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger }}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Verwaltung: Mitarbeiter-Zugänge (individuelle Logins)
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// Backoffice: Artikelverwaltung
// ---------------------------------------------------------------
function ArtikelverwaltungView({ itemsCatalog, saveItemsCatalog, showToast }) {
  const [name, setName] = useState(""); const [cat, setCat] = useState(CATEGORIES[0].id);
  const [priceAktiv, setPriceAktiv] = useState(""); const [priceGoenner, setPriceGoenner] = useState(""); const [pricePassiv, setPricePassiv] = useState("");
  const [stock, setStock] = useState(""); const [editId, setEditId] = useState(null);
  const [filterCat, setFilterCat] = useState("alle");
  const reset = () => { setName(""); setCat(CATEGORIES[0].id); setPriceAktiv(""); setPriceGoenner(""); setPricePassiv(""); setStock(""); setEditId(null); };
  const save = () => {
    const a = parseFloat(priceAktiv.replace(",", "."));
    const g = parseFloat(priceGoenner.replace(",", "."));
    const p = parseFloat(pricePassiv.replace(",", "."));
    if (!name.trim() || !a || !g || !p) return;
    const stockVal = stock.trim() === "" ? undefined : parseInt(stock, 10);
    const prices = { aktiv: a, goenner: g, passiv: p };
    if (editId) { saveItemsCatalog(itemsCatalog.map((i) => (i.id === editId ? { ...i, name, cat, prices, base: undefined, stock: stockVal } : i))); showToast("Artikel aktualisiert"); }
    else { saveItemsCatalog([...itemsCatalog, { id: Date.now(), name, cat, prices, stock: stockVal }]); showToast("Artikel erstellt"); }
    reset();
  };
  const edit = (i) => {
    setEditId(i.id); setName(i.name); setCat(i.cat);
    const pr = i.prices || tp(i.base);
    setPriceAktiv(String(pr.aktiv)); setPriceGoenner(String(pr.goenner)); setPricePassiv(String(pr.passiv));
    setStock(i.stock === undefined ? "" : String(i.stock));
  };
  const remove = (id) => { saveItemsCatalog(itemsCatalog.filter((i) => i.id !== id)); if (editId === id) reset(); };
  const toggleHidden = (id) => saveItemsCatalog(itemsCatalog.map((i) => (i.id === id ? { ...i, hidden: !i.hidden } : i)));
  const shown = [...(filterCat === "alle" ? itemsCatalog : itemsCatalog.filter((i) => i.cat === filterCat))].sort((a, b) => a.name.localeCompare(b.name, "de"));

  return (
    <div>
      <SectionLabel>Artikelverwaltung</SectionLabel>
      <Card style={{ marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Artikelname" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ ...body, padding: "6px 10px", borderRadius: 8, border: `1px solid ${cat === c.id ? colors.amber : colors.hairline}`, background: cat === c.id ? `${colors.amber}1A` : colors.surfaceRaised, color: cat === c.id ? colors.amber : colors.textMuted, fontSize: 11, fontWeight: 700 }}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Preise pro Stufe (CHF)</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={priceAktiv} onChange={(e) => setPriceAktiv(e.target.value)} placeholder="Aktiv" inputMode="decimal" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${tierColor.aktiv}60`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none" }} />
          <input value={priceGoenner} onChange={(e) => setPriceGoenner(e.target.value)} placeholder="Gönner" inputMode="decimal" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${tierColor.goenner}60`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none" }} />
          <input value={pricePassiv} onChange={(e) => setPricePassiv(e.target.value)} placeholder="Passiv" inputMode="decimal" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${tierColor.passiv}60`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none" }} />
        </div>
        <input value={stock} onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Lager (optional)" inputMode="numeric" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>{editId ? "Speichern" : "Artikel erstellen"}</button>
          {editId && <button onClick={reset} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "10px 16px" }}>Abbrechen</button>}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
        <button onClick={() => setFilterCat("alle")} style={{ ...body, flexShrink: 0, padding: "6px 12px", borderRadius: 999, border: `1px solid ${filterCat === "alle" ? colors.amber : colors.hairline}`, background: filterCat === "alle" ? `${colors.amber}1A` : colors.surface, color: filterCat === "alle" ? colors.amber : colors.textMuted, fontSize: 11.5, fontWeight: 700 }}>Alle</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setFilterCat(c.id)} style={{ ...body, flexShrink: 0, padding: "6px 12px", borderRadius: 999, border: `1px solid ${filterCat === c.id ? colors.amber : colors.hairline}`, background: filterCat === c.id ? `${colors.amber}1A` : colors.surface, color: filterCat === c.id ? colors.amber : colors.textMuted, fontSize: 11.5, fontWeight: 700 }}>{c.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {shown.map((i) => {
          const pr = i.prices || tp(i.base);
          return (
            <Card key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i.hidden ? 0.55 : 1 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 }}>
                  {i.name}
                  {i.hidden && <span style={{ ...body, fontSize: 9.5, fontWeight: 700, color: colors.textMuted, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 999, padding: "1px 7px" }}>AUSGEBLENDET</span>}
                </div>
                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{CATEGORIES.find((c) => c.id === i.cat)?.label}</div>
              </div>
              {i.stock !== undefined && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...display, color: i.stock <= 5 ? colors.danger : colors.teal, fontSize: 13 }}>{i.stock}</div>
                  <div style={{ ...body, color: colors.textMuted, fontSize: 10 }}>Lager</div>
                </div>
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{ ...body, fontSize: 11, color: colors.textMuted }}>
                  <span style={{ color: tierColor.aktiv }}>{chf(pr.aktiv)}</span> · <span style={{ color: tierColor.goenner }}>{chf(pr.goenner)}</span> · <span style={{ color: tierColor.passiv }}>{chf(pr.passiv)}</span>
                </div>
              </div>
              <button onClick={() => toggleHidden(i.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: i.hidden ? colors.textMuted : colors.amber }} title={i.hidden ? "Einblenden" : "Ausblenden"}>
                {i.hidden ? <Delete size={13} /> : <Check size={13} />}
              </button>
              <button onClick={() => edit(i)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal }}><Pencil size={13} /></button>
              <button onClick={() => remove(i.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger }}><Trash2 size={13} /></button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Backoffice: Stornierungen
// ---------------------------------------------------------------
function StornierungenView({ sales, saveSales, members, saveMembers, showToast }) {
  const stornieren = (sale) => {
    if (sale.method === "debitor" && sale.member) {
      const member = members.find((m) => m.name === sale.member);
      if (member) saveMembers(members.map((m) => (m.id === member.id ? { ...m, debitor: +(m.debitor - sale.total).toFixed(2) } : m)));
    }
    saveSales(sales.filter((s) => s.id !== sale.id));
    showToast(`Storniert: ${chf(sale.total)}`);
  };

  return (
    <div>
      <SectionLabel>Stornierungen</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
        Betrifft nur die aktuelle, noch offene Session. Bei Debitor-Verkäufen wird der Betrag automatisch vom Mitgliederkonto zurückgebucht.
      </div>
      {sales.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Keine Verkäufe in dieser Session</div></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sales.map((s) => (
          <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{s.items || "—"}{s.member ? ` · ${s.member}` : ""}</div>
              <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{s.time} · {s.staff} · {s.method.toUpperCase()}</div>
            </div>
            <div style={{ ...display, color: colors.amber, fontSize: 14 }}>{chf(s.total)}</div>
            <button onClick={() => stornieren(s)} style={{ background: `${colors.danger}1A`, border: `1px solid ${colors.danger}40`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger, flexShrink: 0 }}>
              <RotateCcw size={15} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Backoffice: Monats- / Jahresabschluss
// ---------------------------------------------------------------
function AbschluesseView({ closedPeriods }) {
  const [range, setRange] = useState("monat");
  const groups = useMemo(() => {
    const g = {};
    closedPeriods.forEach((p) => {
      const d = new Date(p.date);
      const key = range === "monat" ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : `${d.getFullYear()}`;
      if (!g[key]) g[key] = { total: 0, bar: 0, twint: 0, debitor: 0, count: 0, periods: [] };
      g[key].total += p.total; g[key].bar += p.bar; g[key].twint += p.twint; g[key].debitor += p.debitor; g[key].count += 1;
      g[key].periods.push(p);
    });
    return Object.entries(g).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [closedPeriods, range]);

  return (
    <div>
      <SectionLabel>Monats- &amp; Jahresabschluss</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ id: "monat", label: "Monat" }, { id: "jahr", label: "Jahr" }].map((r) => (
          <button key={r.id} onClick={() => setRange(r.id)} style={{ ...body, flex: 1, padding: "9px 0", borderRadius: 10, border: `1px solid ${range === r.id ? colors.amber : colors.hairline}`, background: range === r.id ? `${colors.amber}1A` : colors.surface, color: range === r.id ? colors.amber : colors.textMuted, fontSize: 12.5, fontWeight: 700 }}>
            {r.label}
          </button>
        ))}
      </div>
      {groups.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine abgeschlossenen Perioden – „Tagesabschluss & Session zurücksetzen" legt hier automatisch einen Eintrag an.</div></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {groups.map(([key, g]) => (
          <Card key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ ...display, color: colors.text, fontSize: 16 }}>{key}</div>
              <div style={{ ...body, color: colors.textMuted, fontSize: 11.5 }}>{g.count} Abschlüsse</div>
            </div>
            {[["Bar", g.bar], ["TWINT", g.twint], ["Debitor", g.debitor]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                <span style={{ ...body, color: colors.textMuted, fontSize: 12.5 }}>{label}</span>
                <span style={{ ...body, color: colors.text, fontSize: 12.5 }}>{chf(val)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, marginTop: 6, borderTop: `1px solid ${colors.hairline}` }}>
              <span style={{ ...body, color: colors.text, fontWeight: 700, fontSize: 13 }}>Total</span>
              <span style={{ ...display, color: colors.amber, fontSize: 16 }}>{chf(g.total)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Gerätepflege
// ---------------------------------------------------------------
function GeraetepflegeView({ equipment, saveEquipment, showToast }) {
  const [name, setName] = useState(""); const [cat, setCat] = useState(EQUIPMENT_CATEGORIES[0].id); const [task, setTask] = useState(""); const [interval, setInterval2] = useState("14"); const [editId, setEditId] = useState(null);
  const [filterCat, setFilterCat] = useState("alle");
  const [issueDraft, setIssueDraft] = useState({});
  const [issueOpenFor, setIssueOpenFor] = useState(null);
  const today = new Date();
  const reset = () => { setName(""); setCat(EQUIPMENT_CATEGORIES[0].id); setTask(""); setInterval2("14"); setEditId(null); };
  const daysSince = (dateStr) => Math.floor((today - new Date(dateStr)) / (1000 * 60 * 60 * 24));

  const save = () => {
    const iv = parseInt(interval, 10);
    if (!name.trim() || !task.trim() || !iv) return;
    if (editId) { saveEquipment(equipment.map((e) => (e.id === editId ? { ...e, name, cat, task, intervalDays: iv } : e))); showToast("Gerät aktualisiert"); }
    else { saveEquipment([...equipment, { id: Date.now(), name, cat, task, intervalDays: iv, lastDone: today.toISOString().slice(0, 10), issues: [] }]); showToast("Gerät erfasst"); }
    reset();
  };
  const edit = (e) => { setEditId(e.id); setName(e.name); setCat(e.cat || "sonstiges"); setTask(e.task); setInterval2(String(e.intervalDays)); };
  const remove = (id) => { saveEquipment(equipment.filter((e) => e.id !== id)); if (editId === id) reset(); };
  const markDone = (id) => { saveEquipment(equipment.map((e) => (e.id === id ? { ...e, lastDone: today.toISOString().slice(0, 10) } : e))); showToast("Als erledigt markiert"); };

  const reportIssue = (id) => {
    const text = (issueDraft[id] || "").trim();
    if (!text) return;
    saveEquipment(equipment.map((e) => (e.id === id ? { ...e, issues: [{ id: Date.now(), note: text, date: today.toLocaleDateString("de-CH"), resolved: false }, ...(e.issues || [])] } : e)));
    setIssueDraft((d) => ({ ...d, [id]: "" }));
    setIssueOpenFor(null);
    showToast("Störung gemeldet");
  };
  const resolveIssue = (equipId, issueId) => {
    saveEquipment(equipment.map((e) => (e.id === equipId ? { ...e, issues: e.issues.map((i) => (i.id === issueId ? { ...i, resolved: true } : i)) } : e)));
    showToast("Störung als behoben markiert");
  };

  const withOpenIssues = equipment.filter((e) => (e.issues || []).some((i) => !i.resolved));
  const shown = [...(filterCat === "alle" ? equipment : equipment.filter((e) => e.cat === filterCat))].sort((a, b) => a.name.localeCompare(b.name, "de"));

  return (
    <div>
      <SectionLabel>Gerätepflege</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
        Alle Geräte des Vereins — von Licht & Ton über Bar-Technik bis Router & Computer. Pflegeintervall und Störungen an einem Ort, frei anpassbar.
      </div>

      {withOpenIssues.length > 0 && (
        <Card style={{ background: `${colors.danger}0D`, border: `1px solid ${colors.danger}40`, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={15} color={colors.danger} />
            <span style={{ ...body, color: colors.danger, fontWeight: 700, fontSize: 13 }}>{withOpenIssues.length} offene Störung(en)</span>
          </div>
          {withOpenIssues.map((e) => (
            <div key={e.id} style={{ marginBottom: 6 }}>
              {(e.issues || []).filter((i) => !i.resolved).map((i) => (
                <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  <span style={{ ...body, color: colors.text, fontSize: 12.5, flex: 1 }}>
                    <strong>{e.name}</strong>: {i.note} <span style={{ color: colors.textMuted }}>({i.date})</span>
                  </span>
                  <button onClick={() => resolveIssue(e.id, i.id)} style={{ ...body, fontSize: 11, fontWeight: 700, color: colors.teal, background: "transparent", border: `1px solid ${colors.teal}40`, borderRadius: 8, padding: "4px 8px" }}>Behoben</button>
                </div>
              ))}
            </div>
          ))}
        </Card>
      )}

      <Card style={{ marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Gerät (z. B. Router Vereinsheim)" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {EQUIPMENT_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ ...body, padding: "6px 10px", borderRadius: 8, border: `1px solid ${cat === c.id ? colors.amber : colors.hairline}`, background: cat === c.id ? `${colors.amber}1A` : colors.surfaceRaised, color: cat === c.id ? colors.amber : colors.textMuted, fontSize: 11, fontWeight: 700 }}>
              {c.label}
            </button>
          ))}
        </div>
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Pflegeaufgabe (z. B. Firmware prüfen)" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
        <input value={interval} onChange={(e) => setInterval2(e.target.value.replace(/\D/g, ""))} placeholder="Intervall in Tagen" inputMode="numeric" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>{editId ? "Speichern" : "Gerät erfassen"}</button>
          {editId && <button onClick={reset} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "10px 16px" }}>Abbrechen</button>}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
        <button onClick={() => setFilterCat("alle")} style={{ ...body, flexShrink: 0, padding: "6px 12px", borderRadius: 999, border: `1px solid ${filterCat === "alle" ? colors.amber : colors.hairline}`, background: filterCat === "alle" ? `${colors.amber}1A` : colors.surface, color: filterCat === "alle" ? colors.amber : colors.textMuted, fontSize: 11.5, fontWeight: 700 }}>Alle</button>
        {EQUIPMENT_CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setFilterCat(c.id)} style={{ ...body, flexShrink: 0, padding: "6px 12px", borderRadius: 999, border: `1px solid ${filterCat === c.id ? colors.amber : colors.hairline}`, background: filterCat === c.id ? `${colors.amber}1A` : colors.surface, color: filterCat === c.id ? colors.amber : colors.textMuted, fontSize: 11.5, fontWeight: 700 }}>{c.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {shown.map((e) => {
          const since = daysSince(e.lastDone);
          const overdue = since >= e.intervalDays;
          const dueIn = e.intervalDays - since;
          const openIssues = (e.issues || []).filter((i) => !i.resolved).length;
          return (
            <Card key={e.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
                    {e.name}
                    {openIssues > 0 && <AlertTriangle size={12} color={colors.danger} />}
                  </div>
                  <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{EQUIPMENT_CATEGORIES.find((c) => c.id === e.cat)?.label || "Sonstiges"} · {e.task}</div>
                </div>
                <button onClick={() => edit(e)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal, flexShrink: 0 }}><Pencil size={13} /></button>
                <button onClick={() => remove(e.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger, flexShrink: 0 }}><Trash2 size={13} /></button>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${colors.hairline}` }}>
                <span style={{ ...body, fontSize: 12, fontWeight: 700, color: overdue ? colors.danger : colors.teal }}>
                  {overdue ? `Überfällig seit ${since - e.intervalDays} Tagen` : `Fällig in ${dueIn} Tagen`}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setIssueOpenFor(issueOpenFor === e.id ? null : e.id)} style={{ ...body, background: "transparent", color: colors.danger, border: `1px solid ${colors.danger}40`, borderRadius: 8, padding: "6px 10px", fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    <AlertTriangle size={12} /> Störung
                  </button>
                  <button onClick={() => markDone(e.id)} style={{ ...body, background: overdue ? colors.danger : colors.surfaceRaised, color: overdue ? "#fff" : colors.text, border: `1px solid ${overdue ? colors.danger : colors.hairline}`, borderRadius: 8, padding: "6px 12px", fontSize: 11.5, fontWeight: 700 }}>
                    Erledigt
                  </button>
                </div>
              </div>

              {issueOpenFor === e.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input
                    value={issueDraft[e.id] || ""}
                    onChange={(ev) => setIssueDraft((d) => ({ ...d, [e.id]: ev.target.value }))}
                    placeholder="Was ist kaputt/gestört?"
                    style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "9px 10px", color: colors.text, fontSize: 13, outline: "none" }}
                  />
                  <button onClick={() => reportIssue(e.id)} style={{ ...body, background: colors.danger, color: "#fff", fontWeight: 700, fontSize: 12.5, border: "none", borderRadius: 10, padding: "9px 14px" }}>Melden</button>
                </div>
              )}

              {openIssues > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${colors.hairline}` }}>
                  {e.issues.filter((i) => !i.resolved).map((i) => (
                    <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                      <span style={{ ...body, color: colors.danger, fontSize: 12, flex: 1 }}>{i.note} · {i.date}</span>
                      <button onClick={() => resolveIssue(e.id, i.id)} style={{ ...body, fontSize: 10.5, fontWeight: 700, color: colors.teal, background: "transparent", border: `1px solid ${colors.teal}40`, borderRadius: 8, padding: "3px 8px" }}>Behoben</button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Backoffice: Veranstaltungen verwalten
// ---------------------------------------------------------------
function VeranstaltungenVerwaltenView({ events, saveEvents, showToast }) {
  const [title, setTitle] = useState(""); const [isoDate, setIsoDate] = useState(""); const [time, setTime] = useState(""); const [location, setLocation] = useState(""); const [type, setType] = useState(EVENT_TYPES[0]); const [editId, setEditId] = useState(null);
  const reset = () => { setTitle(""); setIsoDate(""); setTime(""); setLocation(""); setType(EVENT_TYPES[0]); setEditId(null); };
  const save = () => {
    if (!title.trim() || !isoDate) return;
    if (editId) { saveEvents(events.map((e) => (e.id === editId ? { ...e, title, isoDate, time, location, type } : e))); showToast("Termin aktualisiert"); }
    else { saveEvents([...events, { id: Date.now(), title, isoDate, time, location, type, published: false }]); showToast("Als Entwurf gespeichert"); }
    reset();
  };
  const edit = (e) => { setEditId(e.id); setTitle(e.title); setIsoDate(e.isoDate); setTime(e.time); setLocation(e.location); setType(e.type); };
  const remove = (id) => { saveEvents(events.filter((e) => e.id !== id)); if (editId === id) reset(); };
  const togglePublish = (id) => {
    const entry = events.find((e) => e.id === id);
    saveEvents(events.map((e) => (e.id === id ? { ...e, published: !(e.published !== false) } : e)));
    showToast(entry && entry.published === false ? "Veröffentlicht" : "Zurück in Entwurf");
  };
  const sorted = [...events].sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  return (
    <div>
      <SectionLabel>Veranstaltungen verwalten</SectionLabel>
      <Card style={{ marginBottom: 16 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
        <input type="date" value={isoDate} onChange={(e) => setIsoDate(e.target.value)} style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Zeit (z. B. 20:00)" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none" }} />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ort" style={{ ...body, flex: 1, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {EVENT_TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} style={{ ...body, padding: "6px 10px", borderRadius: 8, border: `1px solid ${type === t ? typeStyle[t] : colors.hairline}`, background: type === t ? `${typeStyle[t]}1A` : colors.surfaceRaised, color: type === t ? typeStyle[t] : colors.textMuted, fontSize: 11, fontWeight: 700 }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>{editId ? "Speichern" : "Termin erstellen"}</button>
          {editId && <button onClick={reset} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "10px 16px" }}>Abbrechen</button>}
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((e) => {
          const isDraft = e.published === false;
          return (
            <Card key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, opacity: isDraft ? 0.65 : 1, border: `1px solid ${isDraft ? colors.amber + "40" : colors.hairline}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 }}>
                  {e.title}
                  {isDraft && <span style={{ ...body, fontSize: 9.5, fontWeight: 700, color: colors.amber, background: `${colors.amber}1A`, border: `1px solid ${colors.amber}40`, borderRadius: 999, padding: "1px 7px" }}>ENTWURF</span>}
                </div>
                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{e.isoDate} · {e.time} · {e.location}</div>
              </div>
              <Pill color={typeStyle[e.type]}>{e.type}</Pill>
              <button onClick={() => togglePublish(e.id)} style={{ background: isDraft ? `${colors.amber}1A` : colors.surfaceRaised, border: `1px solid ${isDraft ? colors.amber + "60" : colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: isDraft ? colors.amber : colors.textMuted, flexShrink: 0 }} title={isDraft ? "Veröffentlichen" : "Zurückziehen"}>
                {isDraft ? <Send size={13} /> : <Check size={13} />}
              </button>
              <button onClick={() => edit(e)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal, flexShrink: 0 }}><Pencil size={13} /></button>
              <button onClick={() => remove(e.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger, flexShrink: 0 }}><Trash2 size={13} /></button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Dokumente
// ---------------------------------------------------------------
function DokumenteView({ documents, saveDocuments, showToast, canEdit }) {
  const [title, setTitle] = useState(""); const [url, setUrl] = useState(""); const [cat, setCat] = useState("Protokolle"); const [editId, setEditId] = useState(null);
  const DOC_CATS = ["Protokolle", "Statuten", "Verträge", "Sonstiges"];
  const reset = () => { setTitle(""); setUrl(""); setCat("Protokolle"); setEditId(null); };
  const save = () => {
    if (!title.trim() || !url.trim()) return;
    if (editId) { saveDocuments(documents.map((d) => (d.id === editId ? { ...d, title, url, cat } : d))); showToast("Dokument aktualisiert"); }
    else { saveDocuments([...documents, { id: Date.now(), title, url, cat, published: false }]); showToast("Als Entwurf gespeichert"); }
    reset();
  };
  const edit = (d) => { setEditId(d.id); setTitle(d.title); setUrl(d.url); setCat(d.cat); };
  const remove = (id) => { saveDocuments(documents.filter((d) => d.id !== id)); if (editId === id) reset(); };
  const togglePublish = (id) => {
    const entry = documents.find((d) => d.id === id);
    saveDocuments(documents.map((d) => (d.id === id ? { ...d, published: !(d.published !== false) } : d)));
    showToast(entry && entry.published === false ? "Veröffentlicht" : "Zurück in Entwurf");
  };
  const visible = canEdit ? documents : documents.filter((d) => d.published !== false);
  const sorted = [...visible].sort((a, b) => a.title.localeCompare(b.title, "de"));

  return (
    <div>
      <SectionLabel>Dokumente</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
        Links zu Protokollen, Statuten & Co. — z. B. ein iCloud-Freigabelink pro Dokument.
      </div>

      {canEdit && (
        <Card style={{ marginBottom: 16 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel (z. B. GV-Protokoll 2026)" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {DOC_CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{ ...body, padding: "6px 10px", borderRadius: 8, border: `1px solid ${cat === c ? colors.amber : colors.hairline}`, background: cat === c ? `${colors.amber}1A` : colors.surfaceRaised, color: cat === c ? colors.amber : colors.textMuted, fontSize: 11, fontWeight: 700 }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Link2 size={14} color={colors.textMuted} style={{ position: "absolute", left: 12, top: 12 }} />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="iCloud-/Freigabelink" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px 10px 34px", color: colors.text, fontSize: 13.5, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>{editId ? "Speichern" : "Dokument hinzufügen"}</button>
            {editId && <button onClick={reset} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "10px 16px" }}>Abbrechen</button>}
          </div>
        </Card>
      )}

      {sorted.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Dokumente hinterlegt</div></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((d) => {
          const isDraft = d.published === false;
          return (
            <Card key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, opacity: isDraft ? 0.65 : 1, border: `1px solid ${isDraft ? colors.amber + "40" : colors.hairline}` }}>
              <Folder size={16} color={colors.teal} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, textDecoration: "none" }}>{d.title}</a>
                  {isDraft && <span style={{ ...body, fontSize: 9.5, fontWeight: 700, color: colors.amber, background: `${colors.amber}1A`, border: `1px solid ${colors.amber}40`, borderRadius: 999, padding: "1px 7px" }}>ENTWURF</span>}
                </div>
                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{d.cat}</div>
              </div>
              {canEdit && (
                <>
                  <button onClick={() => togglePublish(d.id)} style={{ background: isDraft ? `${colors.amber}1A` : colors.surfaceRaised, border: `1px solid ${isDraft ? colors.amber + "60" : colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: isDraft ? colors.amber : colors.textMuted, flexShrink: 0 }} title={isDraft ? "Veröffentlichen" : "Zurückziehen"}>
                    {isDraft ? <Send size={13} /> : <Check size={13} />}
                  </button>
                  <button onClick={() => edit(d)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal, flexShrink: 0 }}><Pencil size={13} /></button>
                  <button onClick={() => remove(d.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger, flexShrink: 0 }}><Trash2 size={13} /></button>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Chatraum
// ---------------------------------------------------------------
const CHAT_CHANNELS = [
  { id: "mitglieder", label: "Mitglieder", roles: ["mitglied", "barteam", "dj", "vorstand", "admin"] },
  { id: "bar", label: "Bar", roles: ["barteam", "vorstand", "admin"] },
  { id: "technik", label: "Technik", roles: ["dj", "vorstand", "admin"] },
  { id: "vorstand", label: "Vorstand", roles: ["vorstand", "admin"] },
];

// ---------------------------------------------------------------
// Bildergalerie
// ---------------------------------------------------------------
function BildergalerieView({ photos, savePhotos, currentUser, showToast }) {
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const canDelete = (p) => p.author === currentUser.name || ["vorstand", "admin"].includes(currentUser.role);

  const uploadPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/photos/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload fehlgeschlagen");
      const data = await res.json();
      savePhotos([{ id: Date.now(), url: data.url, caption: caption.trim(), author: currentUser.name, date: new Date().toLocaleDateString("de-CH") }, ...photos]);
      setCaption("");
      showToast && showToast("Foto hochgeladen");
    } catch (e) {
      showToast && showToast("Upload nur auf dem eigenen Server möglich (nicht in dieser Vorschau)");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const removePhoto = (id) => savePhotos(photos.filter((p) => p.id !== id));

  return (
    <div>
      <SectionLabel>Bildergalerie</SectionLabel>
      <Card style={{ marginBottom: 16 }}>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Beschreibung (optional, z. B. Sommerfest 2026)" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 10 }} />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files[0])} style={{ display: "none" }} />
        <button onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={uploading} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Download size={14} style={{ transform: "rotate(180deg)" }} /> {uploading ? "Lädt hoch…" : "Foto hochladen"}
        </button>
      </Card>

      {photos.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Fotos hochgeladen</div></Card>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {photos.map((p) => (
          <div key={p.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${colors.hairline}`, background: colors.surface }}>
            <img src={p.url} alt={p.caption || "Foto"} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "8px 10px" }}>
              {p.caption && <div style={{ ...body, color: colors.text, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{p.caption}</div>}
              <div style={{ ...body, color: colors.textMuted, fontSize: 10.5 }}>{p.author} · {p.date}</div>
            </div>
            {canDelete(p) && (
              <button onClick={() => removePhoto(p.id)} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Globale Suche
// ---------------------------------------------------------------
function SucheView({ staff, members, documents, events }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const matchStaff = query ? staff.filter((s) => s.name.toLowerCase().includes(query)).sort((a, b) => a.name.localeCompare(b.name, "de")) : [];
  const matchMembers = query ? members.filter((m) => m.name.toLowerCase().includes(query)).sort((a, b) => a.name.localeCompare(b.name, "de")) : [];
  const matchDocs = query ? documents.filter((d) => d.title.toLowerCase().includes(query)).sort((a, b) => a.title.localeCompare(b.title, "de")) : [];
  const matchEvents = query ? events.filter((e) => e.title.toLowerCase().includes(query)).sort((a, b) => a.title.localeCompare(b.title, "de")) : [];
  const noResults = query && !matchStaff.length && !matchMembers.length && !matchDocs.length && !matchEvents.length;

  const ResultGroup = ({ label, items, render }) =>
    items.length > 0 && (
      <div style={{ marginBottom: 18 }}>
        <SectionLabel>{label}</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{items.map(render)}</div>
      </div>
    );

  return (
    <div>
      <SectionLabel>Globale Suche</SectionLabel>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Search size={15} color={colors.textMuted} style={{ position: "absolute", left: 14, top: 14 }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mitglieder, Mitarbeiter, Dokumente, Termine…" autoFocus style={{ ...body, width: "100%", background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: "12px 14px 12px 40px", color: colors.text, fontSize: 14, outline: "none" }} />
      </div>

      {!query && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Suchbegriff eingeben, um loszulegen</div></Card>}
      {noResults && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Keine Treffer für „{q}"</div></Card>}

      <ResultGroup label="Mitarbeiter" items={matchStaff} render={(s) => (
        <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <UserRound size={15} color={colors.amber} />
          <span style={{ ...body, color: colors.text, fontSize: 13.5, flex: 1 }}>{s.name}</span>
          <RoleBadge role={s.role} position={s.position} />
        </Card>
      )} />
      <ResultGroup label="Mitglieder" items={matchMembers} render={(m) => (
        <Card key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Users size={15} color={colors.teal} />
          <span style={{ ...body, color: colors.text, fontSize: 13.5, flex: 1 }}>{m.name}</span>
          <span style={{ ...display, color: m.debitor > 0 ? colors.danger : colors.teal, fontSize: 13 }}>{chf(m.debitor)}</span>
        </Card>
      )} />
      <ResultGroup label="Dokumente" items={matchDocs} render={(d) => (
        <Card key={d.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Folder size={15} color={colors.teal} />
          <span style={{ ...body, color: colors.text, fontSize: 13.5, flex: 1 }}>{d.title}</span>
        </Card>
      )} />
      <ResultGroup label="Termine" items={matchEvents} render={(e) => (
        <Card key={e.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarDays size={15} color={colors.amber} />
          <span style={{ ...body, color: colors.text, fontSize: 13.5, flex: 1 }}>{e.title}</span>
          <span style={{ ...body, color: colors.textMuted, fontSize: 11.5 }}>{e.isoDate}</span>
        </Card>
      )} />
    </div>
  );
}

// ---------------------------------------------------------------
// Finanzübersicht (v. a. für Kassier) — nur lesend
// ---------------------------------------------------------------
function FinanzuebersichtView({ sales, members, closedPeriods }) {
  const sessionTotal = sales.reduce((s, o) => s + o.total, 0);
  const openDebitor = members.filter((m) => m.debitor > 0).reduce((s, m) => s + m.debitor, 0);
  const openCredit = members.filter((m) => m.debitor < 0).reduce((s, m) => s + Math.abs(m.debitor), 0);
  const historicTotal = closedPeriods.reduce((s, p) => s + p.total, 0);
  const historicByMethod = closedPeriods.reduce((acc, p) => ({ bar: acc.bar + p.bar, twint: acc.twint + p.twint, debitor: acc.debitor + p.debitor }), { bar: 0, twint: 0, debitor: 0 });

  const StatCard = ({ label, value, color }) => (
    <Card style={{ flex: 1, minWidth: 150 }}>
      <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>{label}</div>
      <div style={{ ...display, color, fontSize: 22 }}>{value}</div>
    </Card>
  );

  return (
    <div>
      <SectionLabel>Finanzübersicht</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 16, lineHeight: 1.5 }}>
        Nur lesend — keine Bearbeitungsmöglichkeit. Gedacht für den schnellen Überblick, z. B. für den Kassier.
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard label="Aktuelle Session" value={chf(sessionTotal)} color={colors.amber} />
        <StatCard label="Offene Debitoren" value={chf(openDebitor)} color={colors.danger} />
        <StatCard label="Guthaben (Vorauszahlungen)" value={chf(openCredit)} color={colors.teal} />
        <StatCard label="Gesamtumsatz (alle Abschlüsse)" value={chf(historicTotal)} color={colors.text} />
      </div>
      <SectionLabel>Nach Zahlungsart (gesamt)</SectionLabel>
      <Card>
        {[["Bar", historicByMethod.bar], ["TWINT", historicByMethod.twint], ["Debitor", historicByMethod.debitor]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.hairline}` }}>
            <span style={{ ...body, color: colors.textMuted, fontSize: 13 }}>{label}</span>
            <span style={{ ...body, color: colors.text, fontSize: 13, fontWeight: 600 }}>{chf(val)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ChatroomView({ messages, saveMessages, currentUser, staff, chatGroups, saveChatGroups, showToast }) {
  const roleChannels = CHAT_CHANNELS.filter((c) => c.roles.includes(currentUser.role));
  const myGroups = chatGroups.filter((g) => g.members.includes(currentUser.name));
  const availableChannels = [
    ...roleChannels.map((c) => ({ id: c.id, label: c.label, kind: "rolle" })),
    ...myGroups.map((g) => ({ id: g.id, label: g.name, kind: "gruppe" })),
  ];
  const [channel, setChannel] = useState(availableChannels[0]?.id || "mitglieder");
  const [draft, setDraft] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([currentUser.name]);

  const channelMessages = messages.filter((m) => (m.channel || "mitglieder") === channel);
  const activeGroup = myGroups.find((g) => g.id === channel);
  const currentLabel = availableChannels.find((c) => c.id === channel)?.label || "";

  const send = () => {
    if (!draft.trim()) return;
    saveMessages([...messages, { id: Date.now(), author: currentUser.name, text: draft.trim(), time: now(), channel }]);
    setDraft("");
  };

  const toggleMember = (name) => {
    setSelectedMembers((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const createGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    const g = { id: "g" + Date.now(), name: groupName.trim(), members: selectedMembers, createdBy: currentUser.name };
    saveChatGroups([...chatGroups, g]);
    setChannel(g.id);
    setGroupName(""); setSelectedMembers([currentUser.name]); setShowNewGroup(false);
    showToast && showToast("Gruppe erstellt");
  };

  const toggleGroupMember = (name) => {
    if (!activeGroup) return;
    const has = activeGroup.members.includes(name);
    if (has && activeGroup.members.length <= 1) return; // letzte Person kann sich nicht selbst entfernen
    const nextMembers = has ? activeGroup.members.filter((n) => n !== name) : [...activeGroup.members, name];
    saveChatGroups(chatGroups.map((g) => (g.id === activeGroup.id ? { ...g, members: nextMembers } : g)));
  };

  const leaveGroup = () => {
    if (!activeGroup) return;
    saveChatGroups(chatGroups.map((g) => (g.id === activeGroup.id ? { ...g, members: g.members.filter((n) => n !== currentUser.name) } : g)));
    setShowManage(false);
    setChannel(availableChannels[0]?.id || "mitglieder");
    showToast && showToast("Gruppe verlassen");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionLabel>Vereinschat</SectionLabel>
        <button onClick={() => setShowNewGroup(true)} style={{ ...body, display: "flex", alignItems: "center", gap: 6, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "6px 12px", color: colors.amber, fontSize: 12, fontWeight: 700 }}>
          <UserPlus size={13} /> Neue Gruppe
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
        {availableChannels.map((c) => {
          const active = channel === c.id;
          return (
            <button key={c.id} onClick={() => setChannel(c.id)} style={{ ...body, flexShrink: 0, padding: "8px 14px", borderRadius: 999, border: `1px solid ${active ? colors.amber : colors.hairline}`, background: active ? `${colors.amber}1A` : colors.surface, color: active ? colors.amber : colors.textMuted, fontSize: 12.5, fontWeight: 700 }}>
              # {c.label}
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, padding: "8px 12px", background: colors.surface, borderRadius: 10, border: `1px solid ${colors.hairline}` }}>
          <span style={{ ...body, color: colors.textMuted, fontSize: 11.5 }}>{activeGroup.members.length} Mitglieder: {activeGroup.members.join(", ")}</span>
          <button onClick={() => setShowManage(true)} style={{ ...body, color: colors.teal, fontSize: 11.5, fontWeight: 700, background: "transparent", border: "none" }}>Verwalten</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {channelMessages.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Nachrichten in „{currentLabel}" — schreib die erste!</div></Card>}
        {channelMessages.map((m) => (
          <div key={m.id} style={{ background: m.author === currentUser.name ? `${colors.amber}14` : colors.surface, border: `1px solid ${m.author === currentUser.name ? colors.amber + "40" : colors.hairline}`, borderRadius: 12, padding: "10px 12px", alignSelf: m.author === currentUser.name ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 3 }}>
              <span style={{ ...body, fontWeight: 700, fontSize: 11.5, color: colors.amber }}>{m.author}</span>
              <span style={{ ...body, fontSize: 10.5, color: colors.textMuted }}>{m.time}</span>
            </div>
            <div style={{ ...body, color: colors.text, fontSize: 13.5, lineHeight: 1.4 }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, position: "sticky", bottom: 0 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Nachricht in #${currentLabel}…`}
          style={{ ...body, flex: 1, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: "11px 14px", color: colors.text, fontSize: 13.5, outline: "none" }}
        />
        <button onClick={send} style={{ background: colors.amber, border: "none", borderRadius: 12, width: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1305", flexShrink: 0 }}>
          <Send size={17} />
        </button>
      </div>

      {showNewGroup && (
        <div onClick={() => setShowNewGroup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, maxHeight: "80vh", overflowY: "auto", background: colors.surface, borderRadius: "20px 20px 0 0", padding: "20px 18px calc(20px + env(safe-area-inset-bottom))", border: `1px solid ${colors.hairline}`, borderBottom: "none" }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: colors.hairline, margin: "0 auto 16px" }} />
            <div style={{ ...display, color: colors.text, fontSize: 17, marginBottom: 14 }}>Neue Gruppe</div>
            <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Gruppenname" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 14 }} />
            <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Mitglieder auswählen</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {[...staff].sort((a, b) => a.name.localeCompare(b.name, "de")).map((s) => {
                const checked = selectedMembers.includes(s.name);
                const isMe = s.name === currentUser.name;
                return (
                  <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, background: checked ? `${colors.teal}14` : colors.surfaceRaised, border: `1px solid ${checked ? colors.teal + "40" : colors.hairline}`, cursor: isMe ? "default" : "pointer" }}>
                    <input type="checkbox" checked={checked} disabled={isMe} onChange={() => toggleMember(s.name)} style={{ width: 15, height: 15, accentColor: colors.teal }} />
                    <span style={{ ...body, fontSize: 13, color: colors.text }}>{s.name}{isMe ? " (du)" : ""}</span>
                  </label>
                );
              })}
            </div>
            <button onClick={createGroup} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "11px 0" }}>Gruppe erstellen</button>
            <button onClick={() => setShowNewGroup(false)} style={{ ...body, width: "100%", marginTop: 8, background: "transparent", border: "none", color: colors.textMuted, fontSize: 13, padding: "8px 0" }}>Abbrechen</button>
          </div>
        </div>
      )}

      {showManage && activeGroup && (
        <div onClick={() => setShowManage(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, maxHeight: "80vh", overflowY: "auto", background: colors.surface, borderRadius: "20px 20px 0 0", padding: "20px 18px calc(20px + env(safe-area-inset-bottom))", border: `1px solid ${colors.hairline}`, borderBottom: "none" }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: colors.hairline, margin: "0 auto 16px" }} />
            <div style={{ ...display, color: colors.text, fontSize: 17, marginBottom: 14 }}>{activeGroup.name}</div>
            <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Mitglieder</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {[...staff].sort((a, b) => a.name.localeCompare(b.name, "de")).map((s) => {
                const checked = activeGroup.members.includes(s.name);
                return (
                  <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, background: checked ? `${colors.teal}14` : colors.surfaceRaised, border: `1px solid ${checked ? colors.teal + "40" : colors.hairline}` }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleGroupMember(s.name)} style={{ width: 15, height: 15, accentColor: colors.teal }} />
                    <span style={{ ...body, fontSize: 13, color: colors.text }}>{s.name}</span>
                  </label>
                );
              })}
            </div>
            <button onClick={leaveGroup} style={{ ...body, width: "100%", background: "transparent", border: `1px solid ${colors.danger}60`, color: colors.danger, fontWeight: 700, fontSize: 13, borderRadius: 10, padding: "11px 0", marginBottom: 8 }}>Gruppe verlassen</button>
            <button onClick={() => setShowManage(false)} style={{ ...body, width: "100%", background: "transparent", border: "none", color: colors.textMuted, fontSize: 13, padding: "8px 0" }}>Schliessen</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Backoffice: Rechte & Rollen (Referenz-Übersicht)
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// Backup
// ---------------------------------------------------------------
function BackupView({ showToast }) {
  const [files, setFiles] = useState(null);
  const [running, setRunning] = useState(false);
  const [supported, setSupported] = useState(true);

  const load = () => {
    fetch("/api/backup/list")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setFiles(d.files); setSupported(true); })
      .catch(() => setSupported(false));
  };
  useEffect(() => { load(); }, []);

  const runBackup = () => {
    setRunning(true);
    fetch("/api/backup", { method: "POST" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => { showToast && showToast("Backup erstellt"); load(); })
      .catch(() => showToast && showToast("Backup nur auf dem eigenen Server möglich"))
      .finally(() => setRunning(false));
  };

  const fmt = (filename) => {
    const iso = filename.replace("db-", "").replace(".json", "").replace(/-/g, (m, i) => (i > 9 ? ":" : "-"));
    try { return new Date(iso).toLocaleString("de-CH"); } catch { return filename; }
  };

  return (
    <div>
      <SectionLabel>Backup</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 16, lineHeight: 1.5 }}>
        Läuft nur auf eurem eigenen Server: automatisch bei jedem Abmelden und einmal täglich. Die letzten 60 Sicherungen werden aufbewahrt.
      </div>
      <Card style={{ marginBottom: 16 }}>
        <button onClick={runBackup} disabled={running} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <RotateCcw size={14} /> {running ? "Läuft…" : "Jetzt sichern"}
        </button>
      </Card>

      {!supported && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Backup-Funktion nicht verfügbar (nicht auf dem eigenen Server)</div></Card>}
      {supported && files && files.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Sicherungen vorhanden</div></Card>}
      {supported && files && files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f) => (
            <Card key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <RotateCcw size={14} color={colors.teal} />
              <span style={{ ...body, color: colors.text, fontSize: 12.5 }}>{fmt(f)}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RechteMatrixView({ roleTabs, saveRoleTabs, showToast }) {
  const EDITABLE_AREAS = [
    { id: "kalender", label: "Kalender" },
    { id: "chat", label: "Chat" },
    { id: "dienste", label: "Dienste" },
    { id: "dj", label: "DJ-Bereich" },
    { id: "dokumente", label: "Dokumente" },
    { id: "galerie", label: "Galerie" },
    { id: "ideenbox", label: "Ideenbox" },
    { id: "kasse", label: "Kasse" },
    { id: "startseite", label: "Startseite" },
  ].sort((a, b) => a.label.localeCompare(b.label, "de"));

  const FIXED_AREAS = [
    { id: "backoffice", label: "Backoffice", roles: ["vorstand", "admin"] },
    { id: "geraetepflege", label: "Gerätepflege", roles: ["barteam", "vorstand", "admin"] },
  ].sort((a, b) => a.label.localeCompare(b.label, "de"));

  const roleIds = Object.keys(ROLE_META);

  const toggle = (roleId, areaId) => {
    const current = roleTabs[roleId] || [];
    const has = current.includes(areaId);
    const next = { ...roleTabs, [roleId]: has ? current.filter((t) => t !== areaId) : [...current, areaId] };
    saveRoleTabs(next);
    showToast && showToast(has ? "Zugriff entfernt" : "Zugriff gewährt");
  };

  return (
    <div>
      <SectionLabel>Rechte &amp; Rollen</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
        Häkchen antippen, um Zugriff pro Rolle ein-/auszublenden. Wirkt sofort auf die Navigation aller Personen mit dieser Rolle.
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 640 }}>
          <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${roleIds.length}, 1fr)`, gap: 4, marginBottom: 4 }}>
            <div />
            {roleIds.map((r) => (
              <div key={r} style={{ ...body, fontSize: 10.5, fontWeight: 700, color: colors.amber, textAlign: "center", padding: "6px 2px" }}>{ROLE_META[r].label}</div>
            ))}
          </div>
          {EDITABLE_AREAS.map((a) => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: `140px repeat(${roleIds.length}, 1fr)`, gap: 4, marginBottom: 4, alignItems: "center" }}>
              <div style={{ ...body, fontSize: 12, color: colors.text, fontWeight: 600 }}>{a.label}</div>
              {roleIds.map((r) => {
                const has = (roleTabs[r] || []).includes(a.id);
                return (
                  <div key={r} style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={() => toggle(r, a.id)} style={{ width: 24, height: 24, borderRadius: 7, background: has ? `${colors.teal}1F` : colors.surfaceRaised, border: `1px solid ${has ? colors.teal + "60" : colors.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      {has ? <Check size={13} color={colors.teal} /> : <span style={{ color: colors.textMuted, fontSize: 12 }}>—</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ ...body, color: colors.textMuted, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, margin: "16px 0 6px" }}>Fest eingerichtet (nicht änderbar)</div>
          {FIXED_AREAS.map((a) => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: `140px repeat(${roleIds.length}, 1fr)`, gap: 4, marginBottom: 4, alignItems: "center", opacity: 0.6 }}>
              <div style={{ ...body, fontSize: 12, color: colors.text, fontWeight: 600 }}>{a.label}</div>
              {roleIds.map((r) => (
                <div key={r} style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {a.roles.includes(r) ? <Check size={13} color={colors.textMuted} /> : <span style={{ color: colors.textMuted, fontSize: 12 }}>—</span>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 14, lineHeight: 1.5 }}>
        Änderungen gelten für alle Personen mit dieser Rolle, sofort. Wer eine ganz eigene Rolle braucht, bekommt das über „Mitarbeiter-Zugänge" zugewiesen.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Startseite (Dashboard für Vorstand/Administrator)
// ---------------------------------------------------------------
function StartseiteView({ sales, members, events, equipment, ideas, resetRequests }) {
  const dayTotal = sales.reduce((s, o) => s + o.total, 0);
  const openDebitorTotal = members.filter((m) => m.debitor > 0).reduce((s, m) => s + m.debitor, 0);
  const openIssues = equipment.reduce((s, e) => s + (e.issues || []).filter((i) => !i.resolved).length, 0);
  const newIdeas = (ideas || []).filter((i) => !i.seen).length;
  const openResets = (resetRequests || []).filter((r) => !r.resolved).length;
  const upcoming = [...events].filter((e) => e.published !== false).sort((a, b) => a.isoDate.localeCompare(b.isoDate)).slice(0, 3);

  const StatCard = ({ label, value, color, icon: Icon }) => (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon size={15} color={color} />
        <span style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
      </div>
      <div style={{ ...display, color, fontSize: 24 }}>{value}</div>
    </Card>
  );

  return (
    <div>
      <SectionLabel>Startseite</SectionLabel>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard label="Umsatz Session" value={chf(dayTotal)} color={colors.amber} icon={Receipt} />
        <StatCard label="Offene Debitoren" value={chf(openDebitorTotal)} color={colors.danger} icon={Users} />
        <StatCard label="Offene Störungen" value={openIssues} color={colors.teal} icon={AlertTriangle} />
        <StatCard label="Neue Ideen" value={newIdeas} color={colors.teal} icon={MessageCircle} />
        <StatCard label="Code-Anfragen" value={openResets} color={colors.danger} icon={ShieldCheck} />
      </div>

      <SectionLabel>Nächste Termine</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
        {upcoming.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Keine Termine erfasst</div></Card>}
        {upcoming.map((e) => (
          <Card key={e.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CalendarDays size={16} color={colors.amber} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{e.title}</div>
              <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{e.isoDate} · {e.time}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Ideenbox
// ---------------------------------------------------------------
function IdeenboxView({ ideas, saveIdeas, currentUser }) {
  const [text, setText] = useState("");
  const canManage = ["vorstand", "admin"].includes(currentUser.role);

  const submit = () => {
    if (!text.trim()) return;
    saveIdeas([{ id: Date.now(), text: text.trim(), author: currentUser.name, date: new Date().toLocaleDateString("de-CH"), seen: false }, ...ideas]);
    setText("");
  };
  const markSeen = (id) => saveIdeas(ideas.map((i) => (i.id === id ? { ...i, seen: true } : i)));
  const remove = (id) => saveIdeas(ideas.filter((i) => i.id !== id));

  const visible = canManage ? ideas : ideas.filter((i) => i.author === currentUser.name);

  return (
    <div>
      <SectionLabel>Ideenbox</SectionLabel>
      <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>
        {canManage ? "Alle eingereichten Ideen der Mitglieder." : "Deine Idee geht direkt an den Vorstand."}
      </div>
      <Card style={{ marginBottom: 16 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Deine Idee für den Verein…"
          rows={3}
          style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 10, resize: "vertical" }}
        />
        <button onClick={submit} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0" }}>Idee einreichen</button>
      </Card>

      {visible.length === 0 && <Card><div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center" }}>Noch keine Ideen</div></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map((i) => (
          <Card key={i.id} style={{ background: !i.seen && canManage ? `${colors.teal}0D` : colors.surface, border: `1px solid ${!i.seen && canManage ? colors.teal + "40" : colors.hairline}` }}>
            <div style={{ ...body, color: colors.text, fontSize: 13.5, lineHeight: 1.5, marginBottom: 8 }}>{i.text}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ ...body, color: colors.textMuted, fontSize: 11 }}>{canManage ? i.author : "Du"} · {i.date}</span>
              {canManage && (
                <div style={{ display: "flex", gap: 6 }}>
                  {!i.seen && <button onClick={() => markSeen(i.id)} style={{ ...body, fontSize: 10.5, fontWeight: 700, color: colors.teal, background: "transparent", border: `1px solid ${colors.teal}40`, borderRadius: 8, padding: "4px 8px" }}>Gesehen</button>}
                  <button onClick={() => remove(i.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminView({ staff, saveStaff, members, saveMembers, showToast, resetRequests, saveResetRequests }) {
  const [name, setName] = useState(""); const [role, setRole] = useState("barteam"); const [position, setPosition] = useState(""); const [pin, setPin] = useState(""); const [editId, setEditId] = useState(null);
  const [bulkNames, setBulkNames] = useState("");
  const [bulkTier, setBulkTier] = useState("aktiv");
  const [bulkResult, setBulkResult] = useState(null);
  const reset = () => { setName(""); setRole("barteam"); setPosition(""); setPin(""); setEditId(null); };
  const save = () => {
    if (!name.trim() || pin.length !== 4) return;
    if (staff.some((s) => s.pin === pin && s.id !== editId)) { showToast("PIN bereits vergeben"); return; }
    if (editId) { saveStaff(staff.map((s) => (s.id === editId ? { ...s, name, role, position, pin } : s))); showToast("Zugang aktualisiert"); }
    else { saveStaff([...staff, { id: Date.now(), name, role, position, pin, setupToken: genToken() }]); showToast("Zugang erstellt"); }
    reset();
  };
  const edit = (s) => { setEditId(s.id); setName(s.name); setRole(s.role); setPosition(s.position || ""); setPin(s.pin); };
  const remove = (id) => { saveStaff(staff.filter((s) => s.id !== id)); if (editId === id) reset(); };

  const genToken = () => Math.random().toString(36).slice(2, 12);
  const generatePin = (taken) => {
    let code;
    do { code = String(Math.floor(1000 + Math.random() * 9000)); } while (taken.has(code));
    taken.add(code);
    return code;
  };

  const csvInputRef = React.useRef(null);
  const handleCsvFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target.result);
      // Nimmt die erste "Spalte" jeder Zeile (Komma oder Semikolon getrennt), überspringt eine mögliche Kopfzeile
      const names = text
        .split(/\r?\n/)
        .map((line) => line.split(/[,;]/)[0].trim())
        .filter((n) => n && !/^(name|vorname|mitglied)$/i.test(n));
      setBulkNames((prev) => (prev ? prev + "\n" : "") + names.join("\n"));
      showToast && showToast(`${names.length} Namen aus CSV übernommen`);
    };
    reader.readAsText(file, "utf-8");
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const runBulkImport = () => {
    const names = bulkNames.split("\n").map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    const taken = new Set(staff.map((s) => s.pin));
    const newStaff = [];
    const newMembers = [];
    const created = [];
    names.forEach((n, i) => {
      const pinCode = generatePin(taken);
      const token = genToken();
      const id = Date.now() + i;
      newStaff.push({ id, name: n, role: "mitglied", position: "", pin: pinCode, setupToken: token });
      if (!members.some((m) => m.name === n)) {
        newMembers.push({ id: id + 1, name: n, type: bulkTier, debitor: 0, payHistory: [] });
      }
      created.push({ name: n, pin: pinCode, setupToken: token });
    });
    saveStaff([...staff, ...newStaff]);
    if (newMembers.length) saveMembers([...members, ...newMembers]);
    setBulkResult(created);
    setBulkNames("");
    showToast(`${names.length} Zugänge erstellt`);
  };

  const setupLink = (token) => `${window.location.origin}${window.location.pathname}?setup=${token}`;

  const exportBulkCsv = () => {
    if (!bulkResult) return;
    const lines = ["Name;Code;Eigener Link zum Code-Setzen"];
    bulkResult.forEach((r) => lines.push(`${r.name};${r.pin};${setupLink(r.setupToken)}`));
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Mitglieder_Zugangscodes.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      {resetRequests.filter((r) => !r.resolved).length > 0 && (
        <div>
          <SectionLabel>Offene „Code vergessen"-Anfragen</SectionLabel>
          <div className="flex flex-col gap-2">
            {resetRequests.filter((r) => !r.resolved).map((r) => {
              const person = staff.find((s) => s.name === r.name);
              return (
                <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${colors.amber}40` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{r.name}</div>
                    <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>{r.date}</div>
                  </div>
                  {person ? (
                    <button
                      onClick={() => {
                        const taken = new Set(staff.map((s) => s.pin));
                        let code;
                        do { code = String(Math.floor(1000 + Math.random() * 9000)); } while (taken.has(code));
                        saveStaff(staff.map((s) => (s.id === person.id ? { ...s, pin: code, setupToken: Math.random().toString(36).slice(2, 12) } : s)));
                        saveResetRequests(resetRequests.map((x) => (x.id === r.id ? { ...x, resolved: true } : x)));
                        showToast(`Neuer Code für ${r.name}: ${code}`);
                      }}
                      style={{ ...body, fontSize: 11.5, fontWeight: 700, color: "#1A1305", background: colors.amber, border: "none", borderRadius: 8, padding: "8px 12px" }}
                    >
                      Neuen Code erstellen
                    </button>
                  ) : (
                    <span style={{ ...body, color: colors.textMuted, fontSize: 11 }}>Kein Zugang mit diesem Namen gefunden</span>
                  )}
                  <button onClick={() => saveResetRequests(resetRequests.map((x) => (x.id === r.id ? { ...x, resolved: true } : x)))} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textMuted, flexShrink: 0 }} title="Ohne Aktion schliessen"><X size={13} /></button>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <SectionLabel>Massenerfassung (viele Mitglieder auf einmal)</SectionLabel>
        <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 }}>
          CSV-Datei einlesen (erste Spalte = Name) oder Namen direkt einfügen, einen pro Zeile — für jede Person wird automatisch ein eigener, eindeutiger 4-stelliger Code erstellt und (falls noch nicht vorhanden) ein Debitorenkonto angelegt.
        </div>
        <Card style={{ marginBottom: 12 }}>
          <input ref={csvInputRef} type="file" accept=".csv,text/csv" onChange={(e) => handleCsvFile(e.target.files[0])} style={{ display: "none" }} />
          <button onClick={() => csvInputRef.current && csvInputRef.current.click()} style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.teal}40`, color: colors.teal, fontWeight: 700, fontSize: 12.5, borderRadius: 10, padding: "9px 0", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Download size={13} style={{ transform: "rotate(180deg)" }} /> CSV-Datei einlesen
          </button>
          <textarea
            value={bulkNames}
            onChange={(e) => setBulkNames(e.target.value)}
            placeholder={"Anna Muster\nBeat Meier\nClaudia Keller\n…"}
            rows={6}
            style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13, outline: "none", marginBottom: 10, resize: "vertical" }}
          />
          <div style={{ ...body, color: colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Preisstufe für alle</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {TIERS.map((t) => (
              <button key={t.id} onClick={() => setBulkTier(t.id)} style={{ ...body, flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${bulkTier === t.id ? tierColor[t.id] : colors.hairline}`, background: bulkTier === t.id ? `${tierColor[t.id]}1A` : colors.surfaceRaised, color: bulkTier === t.id ? tierColor[t.id] : colors.textMuted, fontSize: 11.5, fontWeight: 700 }}>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={runBulkImport} style={{ ...body, width: "100%", background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <UserPlus size={14} /> Zugänge für alle erstellen
          </button>
        </Card>

        {bulkResult && (
          <Card style={{ marginBottom: 16, background: `${colors.teal}0D`, border: `1px solid ${colors.teal}40` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ ...body, color: colors.teal, fontWeight: 700, fontSize: 13 }}>{bulkResult.length} neue Codes</span>
              <button onClick={exportBulkCsv} style={{ ...body, display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${colors.teal}40`, color: colors.teal, borderRadius: 8, padding: "6px 10px", fontSize: 11.5, fontWeight: 700 }}>
                <Download size={12} /> Als CSV
              </button>
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {bulkResult.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", ...body, fontSize: 12.5 }}>
                  <span style={{ color: colors.text }}>{r.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: colors.teal, fontWeight: 700 }}>{r.pin}</span>
                    <button onClick={() => { navigator.clipboard?.writeText(setupLink(r.setupToken)); showToast("Link kopiert"); }} style={{ background: "transparent", border: "none", color: colors.amber, padding: 2 }} title="Eigenen Link kopieren"><Link2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div>
        <SectionLabel>Mitarbeiter-Zugänge</SectionLabel>
        <div style={{ ...body, color: colors.textMuted, fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 }}>
          Jede Person bekommt einen eigenen 4-stelligen Code für den App-Login.
        </div>
        <Card style={{ marginBottom: 12 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {Object.entries(ROLE_META).filter(([id]) => id !== "gast").map(([id, meta]) => (
              <button key={id} onClick={() => setRole(id)} style={{ ...body, flex: 1, padding: "8px 2px", borderRadius: 8, border: `1px solid ${role === id ? colors.amber : colors.hairline}`, background: role === id ? `${colors.amber}1A` : colors.surfaceRaised, color: role === id ? colors.amber : colors.textMuted, fontSize: 10.5, fontWeight: 700 }}>
                {meta.label}
              </button>
            ))}
          </div>
          {role === "vorstand" && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {VORSTAND_POSITIONS.map((p) => (
                <button key={p} onClick={() => setPosition(position === p ? "" : p)} style={{ ...body, padding: "6px 10px", borderRadius: 8, border: `1px solid ${position === p ? colors.teal : colors.hairline}`, background: position === p ? `${colors.teal}1A` : colors.surfaceRaised, color: position === p ? colors.teal : colors.textMuted, fontSize: 10.5, fontWeight: 700 }}>
                  {p}
                </button>
              ))}
            </div>
          )}
          <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="4-stelliger Code" inputMode="numeric" style={{ ...body, width: "100%", background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: "10px 12px", color: colors.text, fontSize: 13.5, outline: "none", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} style={{ ...body, flex: 1, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <UserPlus size={14} /> {editId ? "Speichern" : "Zugang erstellen"}
            </button>
            {editId && <button onClick={reset} style={{ ...body, background: "transparent", border: `1px solid ${colors.hairline}`, color: colors.textMuted, borderRadius: 10, padding: "10px 16px" }}>Abbrechen</button>}
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          {[...staff].sort((a, b) => a.name.localeCompare(b.name, "de")).map((s) => (
            <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: colors.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "center", ...display, color: colors.amber, fontSize: 14, flexShrink: 0 }}>{s.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body, color: colors.text, fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 }}>{s.name} <RoleBadge role={s.role} position={s.position} /></div>
                <div style={{ ...body, color: colors.textMuted, fontSize: 11.5, marginTop: 2 }}>Code: {s.pin}</div>
              </div>
              {s.setupToken && (
                <button onClick={() => { navigator.clipboard?.writeText(setupLink(s.setupToken)); showToast("Link kopiert"); }} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.amber }} title="Eigenen Link zum Code-Setzen kopieren"><Link2 size={13} /></button>
              )}
              <button onClick={() => edit(s)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.teal }}><Pencil size={13} /></button>
              <button onClick={() => remove(s.id)} style={{ background: colors.surfaceRaised, border: `1px solid ${colors.hairline}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: colors.danger }}><Trash2 size={13} /></button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Login
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// Eigenen Code setzen (über persönlichen Link, ?setup=token)
// ---------------------------------------------------------------
function SetupCodeScreen({ user, staff, saveStaff, onDone }) {
  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [stage, setStage] = useState("enter"); // enter -> confirm -> done
  const [error, setError] = useState("");

  const pressDigit = (d) => {
    if (stage === "enter") {
      if (code.length >= 4) return;
      setCode(code + d);
    } else if (stage === "confirm") {
      if (confirmCode.length >= 4) return;
      setConfirmCode(confirmCode + d);
    }
  };
  const backspace = () => {
    if (stage === "enter") setCode(code.slice(0, -1));
    else setConfirmCode(confirmCode.slice(0, -1));
  };

  useEffect(() => {
    if (stage === "enter" && code.length === 4) {
      setTimeout(() => setStage("confirm"), 150);
    }
  }, [code, stage]);

  useEffect(() => {
    if (stage === "confirm" && confirmCode.length === 4) {
      if (confirmCode !== code) {
        setError("Stimmt nicht überein — nochmal von vorne.");
        setTimeout(() => { setCode(""); setConfirmCode(""); setStage("enter"); setError(""); }, 900);
        return;
      }
      if (staff.some((s) => s.pin === confirmCode && s.id !== user.id)) {
        setError("Dieser Code ist schon vergeben — wähl einen anderen.");
        setTimeout(() => { setCode(""); setConfirmCode(""); setStage("enter"); setError(""); }, 1200);
        return;
      }
      saveStaff(staff.map((s) => (s.id === user.id ? { ...s, pin: confirmCode } : s)));
      setStage("done");
    }
  }, [confirmCode, stage]);

  const dots = stage === "confirm" ? confirmCode : code;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {stage === "done" ? (
        <>
          <div style={{ ...display, fontSize: 22, textAlign: "center", color: colors.teal, marginBottom: 10 }}>Code gespeichert</div>
          <div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center", maxWidth: 280, marginBottom: 22 }}>Hallo {user.name}, dein neuer Code ist aktiv. Du kannst dich jetzt einloggen.</div>
          <button onClick={onDone} style={{ ...body, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 12, padding: "12px 24px" }}>Zum Login</button>
        </>
      ) : (
        <>
          <div style={{ ...display, fontSize: 24, marginBottom: 6, textAlign: "center" }}>Hallo {user.name}<span style={{ color: colors.amber }}>.</span></div>
          <div style={{ ...body, color: colors.textMuted, fontSize: 13, marginBottom: 26, textAlign: "center" }}>{stage === "enter" ? "Wähle deinen persönlichen 4-stelligen Code" : "Nochmal zur Bestätigung eingeben"}</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: i < dots.length ? (error ? colors.danger : colors.amber) : colors.surfaceRaised, border: `1px solid ${colors.hairline}`, transition: "background .15s" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, width: "100%", maxWidth: 260 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} onClick={() => pressDigit(String(n))} style={{ ...display, fontSize: 20, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: "50%", width: 64, height: 64, color: colors.text }}>{n}</button>
            ))}
            <div />
            <button onClick={() => pressDigit("0")} style={{ ...display, fontSize: 20, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: "50%", width: 64, height: 64, color: colors.text }}>0</button>
            <button onClick={backspace} style={{ background: "transparent", border: "none", color: colors.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}><Delete size={20} /></button>
          </div>
          {error && <div style={{ ...body, color: colors.danger, fontSize: 12, marginTop: 18, textAlign: "center" }}>{error}</div>}
        </>
      )}
    </div>
  );
}

function LoginScreen({ staff, onLogin, saveResetRequests, resetRequests }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotName, setForgotName] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const pressDigit = (d) => {
    if (code.length >= 4) return;
    const next = code + d;
    setCode(next);
    if (next.length === 4) {
      const user = staff.find((s) => s.pin === next);
      if (user) { setError(false); setTimeout(() => { setMatchedUser(user); setNameInput(user.name); }, 150); }
      else { setError(true); setTimeout(() => { setCode(""); setError(false); }, 500); }
    }
  };

  useEffect(() => {
    if (matchedUser || showForgot) return;
    const onKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") pressDigit(e.key);
      else if (e.key === "Backspace") setCode((c) => c.slice(0, -1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [code, matchedUser, showForgot]);

  const sendForgotRequest = () => {
    if (!forgotName.trim()) return;
    saveResetRequests([...resetRequests, { id: Date.now(), name: forgotName.trim(), date: new Date().toLocaleString("de-CH"), resolved: false }]);
    setForgotSent(true);
  };

  if (showForgot) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 18 }}>
        {forgotSent ? (
          <>
            <div style={{ ...display, fontSize: 20, textAlign: "center", color: colors.teal }}>Anfrage verschickt</div>
            <div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center", maxWidth: 280 }}>Der Vorstand wurde benachrichtigt und meldet sich mit einem neuen Code bei dir.</div>
            <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotName(""); }} style={{ ...body, marginTop: 8, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 20px" }}>Zurück zum Login</button>
          </>
        ) : (
          <>
            <div style={{ ...display, fontSize: 20, textAlign: "center" }}>Code vergessen</div>
            <div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center", maxWidth: 280 }}>Name eingeben — der Vorstand sieht das direkt und generiert dir einen neuen Code.</div>
            <input
              autoFocus
              value={forgotName}
              onChange={(e) => setForgotName(e.target.value)}
              placeholder="Dein Name"
              style={{ ...body, width: "100%", maxWidth: 280, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: "14px 16px", color: colors.text, fontSize: 15, outline: "none", textAlign: "center" }}
            />
            <button onClick={sendForgotRequest} disabled={!forgotName.trim()} style={{ ...body, width: "100%", maxWidth: 280, background: forgotName.trim() ? colors.amber : colors.surfaceRaised, color: forgotName.trim() ? "#1A1305" : colors.textMuted, fontWeight: 700, fontSize: 14.5, border: "none", borderRadius: 12, padding: "14px 0" }}>
              Vorstand benachrichtigen
            </button>
            <button onClick={() => setShowForgot(false)} style={{ ...body, background: "transparent", border: "none", color: colors.textMuted, fontSize: 12.5 }}>Zurück</button>
          </>
        )}
      </div>
    );
  }

  if (matchedUser) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 20 }}>
        <RoleBadge role={matchedUser.role} position={matchedUser.position} />
        <div style={{ ...display, fontSize: 22, textAlign: "center" }}>Wer bist du?</div>
        <input
          autoFocus
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Dein Name"
          style={{ ...body, width: "100%", maxWidth: 280, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: "14px 16px", color: colors.text, fontSize: 15, outline: "none", textAlign: "center" }}
        />
        <button
          onClick={() => nameInput.trim() && onLogin({ id: matchedUser.id, name: nameInput.trim(), role: matchedUser.role, position: matchedUser.position })}
          disabled={!nameInput.trim()}
          style={{ ...body, width: "100%", maxWidth: 280, background: nameInput.trim() ? colors.amber : colors.surfaceRaised, color: nameInput.trim() ? "#1A1305" : colors.textMuted, fontWeight: 700, fontSize: 14.5, border: "none", borderRadius: 12, padding: "14px 0" }}
        >
          Loslegen
        </button>
        <button onClick={() => { setMatchedUser(null); setCode(""); }} style={{ ...body, background: "transparent", border: "none", color: colors.textMuted, fontSize: 12.5 }}>
          Zurück zum Code
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ ...display, fontSize: 26, marginBottom: 6, textAlign: "center" }}>Herzlich Willkommen<span style={{ color: colors.amber }}>.</span></div>
      <div style={{ ...body, color: colors.textMuted, fontSize: 13, marginBottom: 30, textAlign: "center" }}>Verein Wohnzimmer · Vereinsraum</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: i < code.length ? (error ? colors.danger : colors.amber) : colors.surfaceRaised, border: `1px solid ${colors.hairline}`, transition: "background .15s" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, width: "100%", maxWidth: 260 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => pressDigit(String(n))} style={{ ...display, fontSize: 20, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: "50%", width: 64, height: 64, color: colors.text }}>{n}</button>
        ))}
        <div />
        <button onClick={() => pressDigit("0")} style={{ ...display, fontSize: 20, background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: "50%", width: 64, height: 64, color: colors.text }}>0</button>
        <button onClick={() => setCode(code.slice(0, -1))} style={{ background: "transparent", border: "none", color: colors.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}><Delete size={20} /></button>
      </div>
      <div style={{ ...body, color: colors.textMuted, fontSize: 11, marginTop: 26, textAlign: "center" }}>Persönlichen Code eingeben</div>
      <button onClick={() => onLogin({ id: 0, name: "Gast", role: "gast" })} style={{ ...body, marginTop: 18, background: "transparent", border: "none", color: colors.teal, fontSize: 12.5, textDecoration: "underline" }}>
        Kein Zugang? Als Gast fortfahren
      </button>
      <button onClick={() => setShowForgot(true)} style={{ ...body, marginTop: 10, background: "transparent", border: "none", color: colors.textMuted, fontSize: 12, textDecoration: "underline" }}>
        Code vergessen?
      </button>
      <div style={{ ...body, color: colors.textMuted, fontSize: 10.5, marginTop: 22, textAlign: "center", opacity: 0.7 }}>
        Entwickelt von Ivan für Verein Wohnzimmer
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------
function Sidebar({ open, onClose, currentUser, mode, saveMode, onLogout, persistent, tabs, activeTab, onSelectTab, onNavigate }) {
  const [expanded, setExpanded] = useState({ nav: true, sicht: true, backoffice: false, geraetepflege: false, konto: false });
  const canBackoffice = ["vorstand", "admin"].includes(currentUser.role);
  const canGeraete = ["barteam", "vorstand", "admin"].includes(currentUser.role);
  const navigate = (id) => { onNavigate(id); if (!persistent) onClose(); };
  const toggle = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));
  const showModeSwitch = ["barteam", "vorstand", "admin"].includes(currentUser.role);

  const SectionHeader = ({ id, icon: Icon, label, iconColor }) => {
    const isOpen = expanded[id];
    return (
      <button onClick={() => toggle(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: isOpen ? colors.surfaceRaised : "transparent", border: "none", borderLeft: isOpen ? `3px solid ${colors.amber}` : "3px solid transparent" }}>
        <Icon size={17} color={iconColor} />
        <span style={{ ...body, flex: 1, textAlign: "left", color: colors.text, fontWeight: 600, fontSize: 13.5 }}>{label}</span>
        {isOpen ? <ChevronUp size={15} color={colors.textMuted} /> : <ChevronDown size={15} color={colors.textMuted} />}
      </button>
    );
  };

  const panelStyle = persistent
    ? { position: "relative", width: 280, background: colors.bg, borderRight: `1px solid ${colors.hairline}`, display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0, height: "100vh" }
    : { position: "absolute", top: 0, bottom: 0, left: 0, width: 280, background: colors.bg, borderRight: `1px solid ${colors.hairline}`, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .22s ease", display: "flex", flexDirection: "column", overflowY: "auto" };

  return (
    <div style={persistent ? {} : { position: "fixed", inset: 0, zIndex: 60, pointerEvents: open ? "auto" : "none" }}>
      {!persistent && <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", opacity: open ? 1 : 0, transition: "opacity .2s" }} />}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 16px", borderBottom: `1px solid ${colors.hairline}` }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: colors.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "center", ...display, color: colors.amber, fontSize: 16, flexShrink: 0 }}>{currentUser.name[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...body, color: colors.text, fontWeight: 700, fontSize: 14.5 }}>{currentUser.name}</div>
            <div style={{ marginTop: 3 }}><RoleBadge role={currentUser.role} position={currentUser.position} /></div>
          </div>
        </div>

        {persistent && tabs && tabs.length > 0 && (
          <>
            <SectionHeader id="nav" icon={Menu} label="Bereiche" iconColor={colors.amber} />
            {expanded.nav && (
              <div style={{ background: colors.bg, paddingBottom: 6 }}>
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button key={t.id} onClick={() => onSelectTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px 12px 44px", background: active ? `${colors.amber}14` : "transparent", border: "none", borderLeft: active ? `3px solid ${colors.amber}` : "3px solid transparent" }}>
                      <Icon size={15} color={active ? colors.amber : colors.textMuted} />
                      <span style={{ ...body, color: active ? colors.amber : colors.text, fontWeight: active ? 700 : 500, fontSize: 13.5 }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ borderTop: `1px solid ${colors.hairline}` }} />
          </>
        )}

        {showModeSwitch && (
          <>
            <SectionHeader id="sicht" icon={BarChart3} label="Sicht" iconColor={colors.teal} />
            {expanded.sicht && (
              <div style={{ background: colors.bg, paddingBottom: 6 }}>
                {[{ id: "party", label: "Party", icon: PartyPopper }, { id: "normal", label: "Normal", icon: ShieldCheck }].map((mo) => {
                  const Icon = mo.icon;
                  const active = mode === mo.id;
                  const disabled = currentUser.role !== "vorstand" && currentUser.role !== "admin";
                  return (
                    <button key={mo.id} onClick={() => !disabled && saveMode(mo.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px 12px 44px", background: active ? `${colors.amber}14` : "transparent", border: "none", borderLeft: active ? `3px solid ${colors.amber}` : "3px solid transparent", opacity: disabled && !active ? 0.5 : 1 }}>
                      <Icon size={15} color={active ? colors.amber : colors.textMuted} />
                      <span style={{ ...body, color: active ? colors.amber : colors.text, fontWeight: active ? 700 : 500, fontSize: 13.5 }}>{mo.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ borderTop: `1px solid ${colors.hairline}` }} />
          </>
        )}

        {canBackoffice && (
          <>
            <SectionHeader id="backoffice" icon={Store} label="Backoffice" iconColor={colors.amber} />
            {expanded.backoffice && (
              <div style={{ background: colors.bg, paddingBottom: 6 }}>
                {[
                  { id: "artikelverwaltung", label: "Artikelverwaltung", icon: Package },
                  { id: "veranstaltungen", label: "Veranstaltungen verwalten", icon: CalendarPlus },
                  { id: "rechte", label: "Rechte & Rollen", icon: ShieldCheck },
                  { id: "suche", label: "Globale Suche", icon: Search },
                  { id: "finanzen", label: "Finanzübersicht", icon: BarChart3 },
                  { id: "backup", label: "Backup", icon: RotateCcw },
                  { id: "tagesabschluss", label: "Tagesabschluss", icon: ClipboardList },
                  { id: "abschluesse", label: "Monats-/Jahresabschluss", icon: CalendarRange },
                  { id: "stornierungen", label: "Stornierungen", icon: RotateCcw },
                  { id: "belege", label: "Eigene Belege", icon: FileText },
                  { id: "admin", label: "Mitarbeiter-Zugänge", icon: ShieldCheck },
                ].map((it) => {
                  const Icon = it.icon;
                  const active = activeTab === it.id;
                  return (
                    <button key={it.id} onClick={() => navigate(it.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px 11px 44px", background: active ? `${colors.amber}14` : "transparent", border: "none", borderLeft: active ? `3px solid ${colors.amber}` : "3px solid transparent" }}>
                      <Icon size={14} color={active ? colors.amber : colors.textMuted} />
                      <span style={{ ...body, color: active ? colors.amber : colors.text, fontWeight: active ? 700 : 500, fontSize: 13 }}>{it.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ borderTop: `1px solid ${colors.hairline}` }} />
          </>
        )}

        {canGeraete && (
          <>
            <SectionHeader id="geraetepflege" icon={Cpu} label="Gerätepflege" iconColor={colors.teal} />
            {expanded.geraetepflege && (
              <div style={{ background: colors.bg, paddingBottom: 6 }}>
                <button onClick={() => navigate("geraetepflege")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px 11px 44px", background: activeTab === "geraetepflege" ? `${colors.teal}14` : "transparent", border: "none", borderLeft: activeTab === "geraetepflege" ? `3px solid ${colors.teal}` : "3px solid transparent" }}>
                  <Wrench size={14} color={activeTab === "geraetepflege" ? colors.teal : colors.textMuted} />
                  <span style={{ ...body, color: activeTab === "geraetepflege" ? colors.teal : colors.text, fontWeight: activeTab === "geraetepflege" ? 700 : 500, fontSize: 13 }}>Geräte & Störungen</span>
                </button>
              </div>
            )}
            <div style={{ borderTop: `1px solid ${colors.hairline}` }} />
          </>
        )}

        <SectionHeader id="konto" icon={UserRound} label="Konto" iconColor={colors.amber} />
        {expanded.konto && (
          <div style={{ background: colors.bg, paddingBottom: 6 }}>
            <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px 12px 44px", background: "transparent", border: "none" }}>
              <LogOut size={15} color={colors.danger} />
              <span style={{ ...body, color: colors.danger, fontWeight: 600, fontSize: 13.5 }}>Abmelden</span>
            </button>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ ...body, color: colors.textMuted, fontSize: 10.5, textAlign: "center", padding: "10px 16px 2px" }}>Verein Wohnzimmer · Vereinsraum</div>
        <div style={{ ...body, color: colors.textMuted, fontSize: 9.5, textAlign: "center", padding: "0 16px 14px", borderTop: `1px solid ${colors.hairline}`, paddingTop: 8, opacity: 0.7 }}>Entwickelt von Ivan</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// App
// ---------------------------------------------------------------
export default function App() {
  const [booting, setBooting] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [resetRequests, setResetRequests] = useState([]);
  const [setupToken] = useState(() => new URLSearchParams(window.location.search).get("setup"));
  const [mode, setMode] = useState("party");
  const [staff, setStaff] = useState(DEFAULT_STAFF);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [sales, setSales] = useState([]);
  const [customBelege, setCustomBelege] = useState([]);
  const [itemsCatalog, setItemsCatalog] = useState(RAW_ITEMS);
  const [closedPeriods, setClosedPeriods] = useState([]);
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);
  const [events, setEvents] = useState(initialEvents);
  const [documents, setDocuments] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [djMixes, setDjMixes] = useState([]);
  const [djPlan, setDjPlan] = useState(initialDjPlan);
  const [ideas, setIdeas] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [shifts, setShifts] = useState(initialShifts);
  const defaultRoleTabs = useMemo(() => Object.fromEntries(Object.entries(ROLE_META).map(([id, meta]) => [id, [...meta.tabs]])), []);
  const [roleTabs, setRoleTabs] = useState(defaultRoleTabs);
  const initialChatGroups = [
    { id: "g1", name: "గదిలో Mitbewohner", members: DEFAULT_STAFF.map((s) => s.name), createdBy: "system" },
    { id: "g2", name: "గదిలో BAR-Crew", members: DEFAULT_STAFF.map((s) => s.name), createdBy: "system" },
    { id: "g3", name: "గదిలో Helfer", members: DEFAULT_STAFF.map((s) => s.name), createdBy: "system" },
  ];
  const [chatGroups, setChatGroups] = useState(initialChatGroups);
  const [availability, setAvailability] = useState({});
  const [swapRequests, setSwapRequests] = useState([]);
  const [view, setView] = useState("kalender");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    (async () => {
      const [st, m, s, c, md, ic, cp, eq, ev, docs, chat, mixes, plan, ideasData, photosData, shiftsData, availData, swapData, roleTabsData, chatGroupsData, resetReqData] = await Promise.all([
        storageGet("staff-users", DEFAULT_STAFF),
        storageGet("members", DEFAULT_MEMBERS),
        storageGet("sales-log", []),
        storageGet("custom-belege", []),
        storageGet("app-mode", "party"),
        storageGet("items-catalog", RAW_ITEMS),
        storageGet("closed-periods", []),
        storageGet("equipment", DEFAULT_EQUIPMENT),
        storageGet("events", initialEvents),
        storageGet("documents", []),
        storageGet("chat-messages", []),
        storageGet("dj-mixes", []),
        storageGet("dj-plan", initialDjPlan),
        storageGet("ideas", []),
        storageGet("photos", []),
        storageGet("shifts", initialShifts),
        storageGet("availability", {}),
        storageGet("swap-requests", []),
        storageGet("role-tabs", defaultRoleTabs),
        storageGet("chat-groups", initialChatGroups),
        storageGet("pin-reset-requests", []),
      ]);
      setStaff(st); setMembers(m); setSales(s); setCustomBelege(c); setMode(md);
      setItemsCatalog(ic); setClosedPeriods(cp); setEquipment(eq);
      setEvents(ev); setDocuments(docs); setChatMessages(chat); setDjMixes(mixes);
      setDjPlan(plan);
      setIdeas(ideasData);
      setPhotos(photosData);
      setShifts(shiftsData);
      setAvailability(availData);
      setSwapRequests(swapData);
      setRoleTabs(roleTabsData);
      setChatGroups(chatGroupsData);
      setResetRequests(resetReqData);
      setBooting(false);
    })();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const saveStaff = (next) => { setStaff(next); storageSet("staff-users", next); };
  const saveMembers = (next) => { setMembers(next); storageSet("members", next); };
  const saveSales = (next) => { setSales(next); storageSet("sales-log", next); };
  const saveCustomBelege = (next) => { setCustomBelege(next); storageSet("custom-belege", next); };
  const saveMode = (next) => { setMode(next); storageSet("app-mode", next); };
  const saveItemsCatalog = (next) => { setItemsCatalog(next); storageSet("items-catalog", next); };
  const saveClosedPeriods = (next) => { setClosedPeriods(next); storageSet("closed-periods", next); };
  const saveEquipment = (next) => { setEquipment(next); storageSet("equipment", next); };
  const saveEvents = (next) => { setEvents(next); storageSet("events", next); };
  const saveDocuments = (next) => { setDocuments(next); storageSet("documents", next); };
  const saveChatMessages = (next) => { setChatMessages(next); storageSet("chat-messages", next); };
  const saveDjMixes = (next) => { setDjMixes(next); storageSet("dj-mixes", next); };
  const saveDjPlan = (next) => { setDjPlan(next); storageSet("dj-plan", next); };
  const saveIdeas = (next) => { setIdeas(next); storageSet("ideas", next); };
  const savePhotos = (next) => { setPhotos(next); storageSet("photos", next); };
  const saveShifts = (next) => { setShifts(next); storageSet("shifts", next); };
  const saveAvailability = (next) => { setAvailability(next); storageSet("availability", next); };
  const saveSwapRequests = (next) => { setSwapRequests(next); storageSet("swap-requests", next); };
  const saveRoleTabs = (next) => { setRoleTabs(next); storageSet("role-tabs", next); };
  const saveChatGroups = (next) => { setChatGroups(next); storageSet("chat-groups", next); };
  const saveResetRequests = (next) => { setResetRequests(next); storageSet("pin-reset-requests", next); };
  const catalog = useMemo(() => catalogWithPrices(itemsCatalog), [itemsCatalog]);
  const consumeStock = (entries) => {
    // entries: [{ id, qty }] — id kann "cX" (eigener Beleg) sein, dann ignorieren
    const deltas = {};
    entries.forEach((e) => { if (typeof e.id === "number") deltas[e.id] = (deltas[e.id] || 0) + e.qty; });
    if (Object.keys(deltas).length === 0) return;
    saveItemsCatalog(itemsCatalog.map((i) => (i.id in deltas && i.stock !== undefined ? { ...i, stock: Math.max(0, i.stock - deltas[i.id]) } : i)));
  };
  const archiveClosedPeriod = (period) => saveClosedPeriods([period, ...closedPeriods]);

  const dayTotal = useMemo(() => sales.reduce((s, o) => s + o.total, 0), [sales]);

  const TABS = useMemo(() => {
    if (!currentUser) return [];
    const tabIds = roleTabs[currentUser.role] || ROLE_META[currentUser.role]?.tabs || ["kalender"];
    return tabIds
      .map((id) => ({ id, ...TAB_META[id] }))
      .sort((a, b) => a.label.localeCompare(b.label, "de"));
  }, [currentUser, mode, roleTabs]);

  const EXTRA_VIEWS = ["tagesabschluss", "artikelverwaltung", "stornierungen", "abschluesse", "geraetepflege", "belege", "admin", "veranstaltungen", "rechte", "suche", "finanzen", "backup"];
  useEffect(() => { if (currentUser && TABS.length && !TABS.find((t) => t.id === view) && !EXTRA_VIEWS.includes(view)) setView(TABS[0].id); }, [TABS, currentUser, view]);

  const handleLogout = () => {
    fetch("/api/backup", { method: "POST" }).catch(() => {});
    setSidebarOpen(false); setCurrentUser(null); setView("kalender");
  };

  if (booting) {
    return (
      <div style={{ ...body, background: colors.bg, minHeight: "100vh", color: colors.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`}</style>
        <Loader2 size={18} className="animate-spin" /> Synchronisiere…
      </div>
    );
  }

  if (setupToken) {
    const setupUser = staff.find((s) => s.setupToken === setupToken);
    return (
      <div style={{ ...body, background: colors.bg, minHeight: "100vh", color: colors.text, display: "flex", justifyContent: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {setupUser ? (
            <SetupCodeScreen user={setupUser} staff={staff} saveStaff={saveStaff} onDone={() => { window.location.href = window.location.pathname; }} />
          ) : (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
              <div style={{ ...display, fontSize: 18, textAlign: "center", color: colors.danger }}>Link ungültig</div>
              <div style={{ ...body, color: colors.textMuted, fontSize: 13, textAlign: "center", maxWidth: 280 }}>Dieser Link funktioniert nicht (mehr). Bitte beim Vorstand einen neuen anfordern.</div>
              <button onClick={() => { window.location.href = window.location.pathname; }} style={{ ...body, marginTop: 8, background: colors.amber, color: "#1A1305", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 10, padding: "10px 20px" }}>Zum Login</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...body, background: colors.bg, minHeight: "100vh", color: colors.text, display: "flex", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
      {!currentUser ? (
        <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <LoginScreen staff={staff} onLogin={setCurrentUser} resetRequests={resetRequests} saveResetRequests={saveResetRequests} />
        </div>
      ) : isDesktop ? (
        // ---------------- Desktop / Mac Layout ----------------
        <div style={{ width: "100%", maxWidth: 1180, display: "flex", minHeight: "100vh" }}>
          <Sidebar
            persistent
            currentUser={currentUser}
            mode={mode}
            saveMode={saveMode}
            onLogout={handleLogout}
            tabs={TABS}
            activeTab={view}
            onSelectTab={setView}
            onNavigate={setView}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ padding: "20px 32px", borderBottom: `1px solid ${colors.hairline}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...display, fontSize: 22, letterSpacing: 0.5 }}>VEREINSRAUM<span style={{ color: colors.amber }}>.</span></div>
                {["barteam", "vorstand", "admin"].includes(currentUser.role) && (
                  <div style={{ ...body, fontSize: 11.5, color: colors.textMuted, marginTop: 2 }}>{mode === "party" ? "Party-Modus" : "Normal-Modus"}</div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ ...display, fontSize: 19, color: colors.teal }}>{chf(dayTotal)}</div>
                <div style={{ ...body, fontSize: 11, color: colors.textMuted }}>{sales.length} Verkäufe</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", maxWidth: 800 }}>
              {view === "kalender" && <KalenderView events={events} />}
              {view === "dienste" && <DiensteView shifts={shifts} saveShifts={saveShifts} currentUser={currentUser} showToast={showToast} availability={availability} saveAvailability={saveAvailability} swapRequests={swapRequests} saveSwapRequests={saveSwapRequests} staff={staff} />}
              {view === "dj" && <DJView mixes={djMixes} saveMixes={saveDjMixes} currentUser={currentUser} showToast={showToast} djPlan={djPlan} saveDjPlan={saveDjPlan} />}
              {view === "kasse" && <KasseView members={members} saveMembers={saveMembers} sales={sales} saveSales={saveSales} showToast={showToast} currentUser={currentUser} customBelege={customBelege} catalog={catalog} consumeStock={consumeStock} readOnlyFor={currentUser.role === "mitglied" ? currentUser.name : null} />}
              {view === "tagesabschluss" && <TagesabschlussView sales={sales} saveSales={saveSales} showToast={showToast} members={members} onArchive={archiveClosedPeriod} />}
              {view === "belege" && <BelegeVerwaltenView customBelege={customBelege} saveCustomBelege={saveCustomBelege} showToast={showToast} />}
              {view === "artikelverwaltung" && <ArtikelverwaltungView itemsCatalog={itemsCatalog} saveItemsCatalog={saveItemsCatalog} showToast={showToast} />}
              {view === "stornierungen" && <StornierungenView sales={sales} saveSales={saveSales} members={members} saveMembers={saveMembers} showToast={showToast} />}
              {view === "abschluesse" && <AbschluesseView closedPeriods={closedPeriods} />}
              {view === "geraetepflege" && <GeraetepflegeView equipment={equipment} saveEquipment={saveEquipment} showToast={showToast} />}
              {view === "veranstaltungen" && <VeranstaltungenVerwaltenView events={events} saveEvents={saveEvents} showToast={showToast} />}
              {view === "dokumente" && <DokumenteView documents={documents} saveDocuments={saveDocuments} showToast={showToast} canEdit={["vorstand", "admin"].includes(currentUser.role)} />}
              {view === "chat" && <ChatroomView messages={chatMessages} saveMessages={saveChatMessages} currentUser={currentUser} staff={staff} chatGroups={chatGroups} saveChatGroups={saveChatGroups} showToast={showToast} />}
              {view === "admin" && <AdminView staff={staff} saveStaff={saveStaff} members={members} saveMembers={saveMembers} showToast={showToast} resetRequests={resetRequests} saveResetRequests={saveResetRequests} />}
              {view === "startseite" && <StartseiteView sales={sales} members={members} events={events} equipment={equipment} ideas={ideas} resetRequests={resetRequests} />}
              {view === "ideenbox" && <IdeenboxView ideas={ideas} saveIdeas={saveIdeas} currentUser={currentUser} />}
              {view === "rechte" && <RechteMatrixView roleTabs={roleTabs} saveRoleTabs={saveRoleTabs} showToast={showToast} />}
              {view === "galerie" && <BildergalerieView photos={photos} savePhotos={savePhotos} currentUser={currentUser} showToast={showToast} />}
              {view === "suche" && <SucheView staff={staff} members={members} documents={documents} events={events} />}
              {view === "finanzen" && <FinanzuebersichtView sales={sales} members={members} closedPeriods={closedPeriods} />}
              {view === "backup" && <BackupView showToast={showToast} />}
            </div>
          </div>
        </div>
      ) : (
        // ---------------- Mobile / Tablet Layout ----------------
        <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} currentUser={currentUser} mode={mode} saveMode={saveMode} onLogout={handleLogout} activeTab={view} onNavigate={setView} />

          <div style={{ padding: "16px 16px 14px", borderBottom: `1px solid ${colors.hairline}`, position: "sticky", top: 0, background: colors.bg, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", color: colors.text }}><Menu size={17} /></button>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...display, fontSize: 19, letterSpacing: 0.5 }}>VEREINSRAUM<span style={{ color: colors.amber }}>.</span></div>
              {["barteam", "vorstand", "admin"].includes(currentUser.role) && (
                <div style={{ ...body, fontSize: 10.5, color: colors.textMuted, marginTop: 1 }}>{mode === "party" ? "Party-Modus" : "Normal-Modus"}</div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...display, fontSize: 16, color: colors.teal }}>{chf(dayTotal)}</div>
              <div style={{ ...body, fontSize: 10, color: colors.textMuted }}>{sales.length} Verkäufe</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 90px" }}>
            {view === "kalender" && <KalenderView events={events} />}
            {view === "dienste" && <DiensteView shifts={shifts} saveShifts={saveShifts} currentUser={currentUser} showToast={showToast} availability={availability} saveAvailability={saveAvailability} swapRequests={swapRequests} saveSwapRequests={saveSwapRequests} staff={staff} />}
            {view === "dj" && <DJView mixes={djMixes} saveMixes={saveDjMixes} currentUser={currentUser} showToast={showToast} djPlan={djPlan} saveDjPlan={saveDjPlan} />}
            {view === "kasse" && <KasseView members={members} saveMembers={saveMembers} sales={sales} saveSales={saveSales} showToast={showToast} currentUser={currentUser} customBelege={customBelege} catalog={catalog} consumeStock={consumeStock} readOnlyFor={currentUser.role === "mitglied" ? currentUser.name : null} />}
            {view === "tagesabschluss" && <TagesabschlussView sales={sales} saveSales={saveSales} showToast={showToast} members={members} onArchive={archiveClosedPeriod} />}
            {view === "belege" && <BelegeVerwaltenView customBelege={customBelege} saveCustomBelege={saveCustomBelege} showToast={showToast} />}
            {view === "artikelverwaltung" && <ArtikelverwaltungView itemsCatalog={itemsCatalog} saveItemsCatalog={saveItemsCatalog} showToast={showToast} />}
            {view === "stornierungen" && <StornierungenView sales={sales} saveSales={saveSales} members={members} saveMembers={saveMembers} showToast={showToast} />}
            {view === "abschluesse" && <AbschluesseView closedPeriods={closedPeriods} />}
            {view === "geraetepflege" && <GeraetepflegeView equipment={equipment} saveEquipment={saveEquipment} showToast={showToast} />}
            {view === "veranstaltungen" && <VeranstaltungenVerwaltenView events={events} saveEvents={saveEvents} showToast={showToast} />}
            {view === "dokumente" && <DokumenteView documents={documents} saveDocuments={saveDocuments} showToast={showToast} canEdit={["vorstand", "admin"].includes(currentUser.role)} />}
            {view === "chat" && <ChatroomView messages={chatMessages} saveMessages={saveChatMessages} currentUser={currentUser} staff={staff} chatGroups={chatGroups} saveChatGroups={saveChatGroups} showToast={showToast} />}
            {view === "admin" && <AdminView staff={staff} saveStaff={saveStaff} members={members} saveMembers={saveMembers} showToast={showToast} resetRequests={resetRequests} saveResetRequests={saveResetRequests} />}
            {view === "startseite" && <StartseiteView sales={sales} members={members} events={events} equipment={equipment} ideas={ideas} resetRequests={resetRequests} />}
            {view === "ideenbox" && <IdeenboxView ideas={ideas} saveIdeas={saveIdeas} currentUser={currentUser} />}
            {view === "rechte" && <RechteMatrixView roleTabs={roleTabs} saveRoleTabs={saveRoleTabs} showToast={showToast} />}
            {view === "galerie" && <BildergalerieView photos={photos} savePhotos={savePhotos} currentUser={currentUser} showToast={showToast} />}
            {view === "suche" && <SucheView staff={staff} members={members} documents={documents} events={events} />}
            {view === "finanzen" && <FinanzuebersichtView sales={sales} members={members} closedPeriods={closedPeriods} />}
            {view === "backup" && <BackupView showToast={showToast} />}
          </div>

          <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: 460, background: colors.surface, borderTop: `1px solid ${colors.hairline}`, display: "flex", padding: "8px 6px calc(8px + env(safe-area-inset-bottom))", overflowX: "auto" }}>
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = view === t.id;
                return (
                  <button key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, minWidth: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px", background: "transparent", border: "none" }}>
                    <Icon size={19} color={active ? colors.amber : colors.textMuted} />
                    <span style={{ ...body, fontSize: 9.5, fontWeight: 600, color: active ? colors.amber : colors.textMuted, whiteSpace: "nowrap" }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
      )}

      {currentUser && toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: colors.teal, color: "#0B2E28", padding: "10px 18px", borderRadius: 999, ...body, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8, zIndex: 50, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>
          <Receipt size={15} /> {toast}
        </div>
      )}
    </div>
  );
}
