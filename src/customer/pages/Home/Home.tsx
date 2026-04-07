import React, { useState } from "react";
import Banner from "./Banner/Banner";
import HomeCategory from "./HomeCategory/HomeCategory";
import TopBrand from "./TopBrands/Grid";
import ElectronicCategory from "./Electronic Category/ElectronicCategory";
import MainCarousel from "./Main Carousel/MainCarousel";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import ChatBot from "../ChatBot/ChatBot";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import DealSlider from "./Deals/Deals";
import type { HomePageContent } from "../../../types/homeContentTypes";

const Home = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const { homePage } = useAppSelector((store) => store);
  const data = homePage.homePageData as HomePageContent | null;

  const isVisible = (key: string) =>
    data?.sections?.find((s) => s.sectionKey === key && s.visible);

  const handleShowChatBot = () => setShowChatBot(!showChatBot);
  const handleCloseChatBot = () => setShowChatBot(false);

  return (
    <>
      {!homePage.loading ? (
        // ✅ outer wrapper has NO space-y so carousel touches navbar directly
        <div className="relative">

          {/* Carousel — flush against navbar, no top margin */}
          <MainCarousel />

          {/* Everything below carousel gets normal spacing */}
          <div className="space-y-6 lg:space-y-12 pb-16 bg-[#f5f6f8]">
            {isVisible("ELECTRONICS") && <ElectronicCategory />}
            {isVisible("TOP_BRAND") && <TopBrand />}
            {data?.shopByCategories && isVisible("SHOP_BY_CATEGORY") && <HomeCategory />}
          </div>

          {/* Chatbot — fixed, always on top */}
          <section className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[9999]">
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
