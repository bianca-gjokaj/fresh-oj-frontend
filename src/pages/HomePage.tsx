// import { useDisclosure } from "@mantine/hooks";
// import { IconPlus } from "@tabler/icons";
// import { useContext } from "react";
// import { useQuery } from "@tanstack/react-query";
import { AppShell, Button, Progress, Stack, Center } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { useCallback, useContext, useEffect, useState } from "react";
import AppContainer from "../components/AppContainer";
import AppHeader from "../components/AppHeader";
import BackGroundImage from "../resources/background-image-w-text.jpg";
import AppFooter from "../components/AppFooter";
import { Link } from "react-router-dom";
import { Entry } from "../types/entry.types";
import { getEntries } from "../services/entry.service";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/auth.context";
import { fetchSuggestion } from "../services/suggestion.service";

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry>({} as Entry);
  const [recentEntry, setRecentEntry] = useState<Entry[]>([]);
  const { user } = useContext(AuthContext);

  const handleScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  const entries = useQuery(
    ["entries", user?._id],
    async () => await getEntries(user?._id as string)
  );

  const articles = useQuery(["suggestions"], fetchSuggestion);

  function randomArticle() {
    const article = articles?.data?.at(
      Math.floor(Math.random() * articles?.data?.length)
    );
    return article;
  }

  useEffect(() => {
    if (embla) {
      embla.on("scroll", handleScroll);
      handleScroll();
    }
  }, [embla]);

  return (
    <div>
      <AppContainer header={<AppHeader />}>
        <div className="p-0 mt-10">
          <img className="w-full h-full  p-0 m-0" src={BackGroundImage} />
        </div>
        <Stack>
          <Link to="/entry" className="font-medium !no-underline">
            <Center>
              <Button
                style={{ width: 600 }}
                className="
              hover:bg-tan-200 bg-orangeSoda-200  shadow-md shadow-black-900 "
              >
                New Entry
              </Button>
            </Center>
          </Link>

          <div className="text-center">My Stats</div>

          <Carousel
            dragFree
            slideSize="30%"
            slideGap="md"
            height={200}
            getEmblaApi={setEmbla}
            initialSlide={1}
            mb={80}
          >
            <Carousel.Slide className="bg-white">
              {entries.data?.at(0)?.titleEntry}
            </Carousel.Slide>
            <Carousel.Slide className="bg-white">
              {entries.data?.at(0)?.mood}
            </Carousel.Slide>
            <Carousel.Slide className="bg-white">
              {randomArticle()?.ImageUrl}
            </Carousel.Slide>
            <Carousel.Slide className="bg-white">Frequent</Carousel.Slide>
            <Carousel.Slide className="bg-white">Frequent</Carousel.Slide>
            {/* Tried to get a random article to show up here... Didn't have any luck yet */}
            {/* ...other slides */}
          </Carousel>
          {/* <Progress
            value={scrollProgress}
            styles={{
              bar: { transitionDuration: "0ms" },
              root: { maxWidth: 320 },
            }}
            size="sm"
            mt="xl"
            mx="auto"
          /> */}
        </Stack>

        <AppFooter />
      </AppContainer>
    </div>
  );
}
