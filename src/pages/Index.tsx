import Header from "@/components/Header";
import LeaguesSidebar from "@/components/LeaguesSidebar";
import MenuSidebar from "@/components/MenuSidebar";
import SportsTabsWithAPI from "@/components/SportsTabsWithAPI";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          <LeaguesSidebar />
          <div className="flex-1">
            <SportsTabsWithAPI />
          </div>
          <MenuSidebar />
        </div>
      </main>
    </div>
  );
};

export default Index;
