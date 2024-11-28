import ProfileView from "@/views/pages/profile";
export default function Profile({ params }: { params: { slug: string } }) {
  return <ProfileView />;
}
