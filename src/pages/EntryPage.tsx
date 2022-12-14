import { useContext, useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import {
  Button,
  Center,
  Container,
  Paper,
  Radio,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AppContainer from "../components/AppContainer";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import { addEntry } from "../services/entry.service";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../libs/react-query";
import { AuthContext } from "../context/auth.context";
import dayjs from "dayjs";

export default function EntryPage() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [titleEntry, setTitleEntry] = useState("");
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const addEntryMutation = useMutation(addEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(["entries", user?._id]);
    },
  });

  const onSubmit = async () => {
    await addEntryMutation.mutateAsync({
      userId: user?._id,
      mood,
      titleEntry,
      dateAdded: dayjs(new Date()).format("MM/DD/YYYY"),
      content,
    });
    navigate("/profile");
  };

  return (
    <AppContainer>
      <AppHeader />

      <Container mb={100}>
        <Center>
          <Title mt={100} color="white" order={1} className="poppin-font">
            What's on your mind?
          </Title>
        </Center>

        <Paper className="mt-5 p-3 px-7">
          <Radio.Group
            label="How do you feel?"
            spacing="xl"
            onChange={setMood}
            withAsterisk
          >
            <div className="flex justify-between w-full">
              <Radio value="Overjoyed" label="Overjoyed" />
              <Radio value="Happy" label="Happy" />
              <Radio value="Okay" label="Okay" />
              <Radio value="Sad" label="Sad" />
              <Radio value="Mad" label="Mad" />
              <Radio value="Anxious" label="Anxious" />
            </div>
          </Radio.Group>
        </Paper>

        <TextInput
          placeholder="Title your entry!"
          label="Title"
          className=" pt-5"
          onChange={(e) => setTitleEntry(e.target.value)}
          withAsterisk
        ></TextInput>

        <RichTextEditor
          classNames={{ root: "mt-7 h-[600px] overflow-y-scroll" }}
          //   mt={40}
          value={content}
          controls={[
            ["bold", "italic", "underline", "link", "image"],
            ["unorderedList", "h1", "h2", "h3"],
            ["sup", "sub"],
            ["alignLeft", "alignCenter", "alignRight"],
          ]}
          onChange={setContent}
        />

        <Button
          mt="md"
          variant="default"
          size="sm"
          onClick={onSubmit}
          type="submit"
          loading={addEntryMutation.isLoading}
        >
          Submit
        </Button>
      </Container>
      <AppFooter />
    </AppContainer>
  );
}
