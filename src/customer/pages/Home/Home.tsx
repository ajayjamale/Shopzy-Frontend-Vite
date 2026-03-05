import React, { useState } from "react";
import Banner from "./Banner/Banner";
import HomeCategory from "./HomeCategory/HomeCategory"; // this is the new dark component
import TopBrand from "./TopBrands/Grid";
import ElectronicCategory from "./Electronic Category/ElectronicCategory";
import MainCarousel from "./Main Carousel/MainCarousel";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import ChatBot from "../ChatBot/ChatBot";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import DealSlider from "./Deals/Deals";

const Home = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const { homePage } = useAppSelector((store) => store);

  const handleShowChatBot = () => setShowChatBot(!showChatBot);
  const handleCloseChatBot = () => setShowChatBot(false);

  return (
    <>
      {!homePage.loading ? (
        <div className="space-y-5 lg:space-y-10 relative">
          {/* Main Fullscreen Carousel */}
          <MainCarousel />

          {/* Electronics Section */}
          {homePage.homePageData?.electricCategories && <ElectronicCategory />}

          {/* Top Brands */}
          {homePage.homePageData?.grid && <TopBrand />}

          {/* Today's Deals */}
          {homePage.homePageData?.deals && (
            <section className="pt-10">
              <DealSlider />
            </section>
          )}

          {/* Shop By Category - replaced with new dark full-width component */}
          {homePage.homePageData?.shopByCategories && <HomeCategory />}

          {/* Chat Button */}
          <section className="fixed bottom-10 right-10">
            {showChatBot ? (
              <ChatBot handleClose={handleCloseChatBot} />
            ) : (
              <Button
                onClick={handleShowChatBot}
                sx={{ borderRadius: "2rem" }}
                variant="contained"
                className="h-16 w-16 flex justify-center items-center rounded-full"
              >
                <ChatBubbleIcon sx={{ color: "white", fontSize: "2rem" }} />
              </Button>
            )}
          </section>
        </div>
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Home;