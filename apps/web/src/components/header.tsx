import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  return (
    <div className="flex items-center gap-4">
      <ModeToggle />
      <UserMenu />
    </div>
  );
}
