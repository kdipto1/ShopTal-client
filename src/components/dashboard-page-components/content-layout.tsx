import DashboardNavbar from "./navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

const ContentLayout = ({ title, children }: ContentLayoutProps) => {
  return (
    <div>
      <DashboardNavbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
};

export default ContentLayout;
