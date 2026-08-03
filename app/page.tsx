import { redirect } from "next/navigation";

/**
 * BlumBlast Root Page
 * 
 * Redirects to login page as the homepage
 */
export default function HomePage() {
  redirect("/login");
}
