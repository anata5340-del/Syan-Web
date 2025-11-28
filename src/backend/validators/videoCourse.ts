import * as yup from "yup";

const createVideoCourseSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  image: yup.string().required("Image is required"),
  color: yup.string().required("Color is required"),
});

const updateVideoCourseSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  image: yup.string().required("Image is required"),
  color: yup.string().required("Color is required"),
});

const createVideoCourseModuleSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  color: yup.string().required("Color is required"),
});

const createVideoCourseModuleSectionSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  color: yup.string().required("Color is required"),
  image: yup.string().required("Image is required"),
  topic: yup.string().required("Topic is required"),
});

const createVideoCourseModuleSubSectionSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  color: yup.string().required("Color is required"),
  image: yup.string().required("Image is required"),
  topic: yup.string().required("Topic is required"),
});

const createVideoCourseModuleSubSectionBlockSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  color: yup.string().required("Color is required"),
  image: yup.string().required("Image is required"),
});

export const createVideoCourseValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      videoCourse: createVideoCourseSchema,
    })
    .validate(data);

export const updateVideoCourseValidator = (id: string, data: unknown) =>
  yup
    .object()
    .shape({
      videoCourse: updateVideoCourseSchema,
    })
    .validate(data);

export const createVideoCourseModuleValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      module: createVideoCourseModuleSchema,
    })
    .validate(data);

export const updateVideoCourseModuleValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      module: createVideoCourseModuleSchema,
    })
    .validate(data);

export const createVideoCourseModuleSectionValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      section: createVideoCourseModuleSectionSchema,
    })
    .validate(data);

export const updateVideoCourseModuleSectionValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      sectionId: yup.string().required("Section Id is required"),
      section: createVideoCourseModuleSectionSchema,
    })
    .validate(data);

export const createVideoCourseModuleSubSectionValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("VideoCourse Id is required"),
      moduleId: yup.string().required("Module Id is required"),
      sectionId: yup.string().required("Section Id is required"),
      subSection: createVideoCourseModuleSubSectionSchema,
    })
    .validate(data);

export const updateVideoCourseModuleSubSectionValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("VideoCourse Id is required"),
      moduleId: yup.string().required("Module Id is required"),
      sectionId: yup.string().required("Section Id is required"),
      subSection: createVideoCourseModuleSubSectionSchema,
    })
    .validate(data);
export const createVideoCourseModuleSubSectionBlockValidator = (
  data: unknown
) =>
  yup
    .object()
    .shape({
      id: yup.string().required("VideoCourse Id is required"),
      moduleId: yup.string().required("Module Id is required"),
      sectionId: yup.string().required("Section Id is required"),
      subSectionId: yup.string().required("Sub Section Id is required"),
      subSectionBlock: createVideoCourseModuleSubSectionBlockSchema,
    })
    .validate(data);

export const updateVideoCourseModuleSubSectionBlockValidator = (
  data: unknown
) =>
  yup
    .object()
    .shape({
      id: yup.string().required("VideoCourse Id is required"),
      moduleId: yup.string().required("Module Id is required"),
      sectionId: yup.string().required("Section Id is required"),
      subSectionId: yup.string().required("Sub Section Id is required"),
      subSectionBlock: createVideoCourseModuleSubSectionBlockSchema,
    })
    .validate(data);
