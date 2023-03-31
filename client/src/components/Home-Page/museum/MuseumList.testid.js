import createTestIdFilePath from "../../../util/createTestIdFilePath";

const TEST_ID = {
  container: `${createTestIdFilePath(
    "pages",
    "Museum",
    "MuseumList"
  )}-container`,
  loadingContainer: `${createTestIdFilePath(
    "pages",
    "Museum",
    "MuseumList"
  )}-loadingContainer`,
  errorContainer: `${createTestIdFilePath(
    "pages",
    "Museum",
    "MuseumList"
  )}-errorContainer`,
  museumList: `${createTestIdFilePath(
    "pages",
    "Museum",
    "MuseumList"
  )}-museumList`,
  createMuseumButton: `${createTestIdFilePath(
    "pages",
    "Museum",
    "MuseumList"
  )}-createMuseumButton`,
};

export default TEST_ID;
