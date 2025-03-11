# Uploadthing UI Components

Custom UI components for Uploadthing built on top of the [shadcn registry]. This project leverages a modern tech stack to help you get a basic scaffold up and running quickly.

## Must Have
Create a `lib/uploadthing.ts` file and add this code in it
```javascript
import { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles, createUpload } =
  generateReactHelpers<OurFileRouter>();
```

## Showcase [1]
**Installation**
```bash
pnpm dlx shadcn@latest add https://uploadthing-ui.vercel.app/r/button-uploadthing.json
```
**Usage**
```javascript
// add inside layout.tsx
<Toaster expand theme="system" gap={8} />
```
```javascript
// add inside a client component

<UTUIButtonUploadthing
  UTUIFunctionsProps={{
    fileRoute: "imageUploader",
    onBeforeUploadBegin: (files) => {
      // Your additional code here

      return files;
    },
    onUploadBegin: (fileName) => {
      // Your additional code here
      console.log(fileName);
    },
    onUploadProgress: (progress) => {
      // Your additional code here
      console.log(progress);
    },
    onClientUploadComplete: (res) => {
      // Your additional code here
      console.log(res);
    },
    onUploadError: (error) => {
      // Your additional code here
      console.log(error);
    },
  }}
/>
```

## Showcase [2]
**Installation**
```bash
pnpm dlx shadcn@latest add https://uploadthing-ui.vercel.app/r/button-generic-drive.json
```
**Usage**
```javascript
// add inside a client component

<UTUIButtonProton
  UTUIFunctionsProps={{
    fileRoute: "imageUploader",
    onBeforeUploadBegin: (files) => {
      // Your additional code here

      return files;
    },
    onUploadBegin: (fileName) => {
      // Your additional code here
      console.log(fileName);
    },
    onUploadProgress: (progress) => {
      // Your additional code here
      console.log(progress);
    },
    onClientUploadComplete: (res) => {
      // Your additional code here
      console.log(res);
    },
    onUploadError: (error) => {
      // Your additional code here
      console.log(error);
    },
  }}
/>
```

## Technologies Used

- **Tailwind CSS** for rapid, responsive styling
- **shadcn components** for a beautiful, consistent UI
- **lucide-react** for iconography
- **cuid2** for generating unique IDs

## Installation

**Clone the repository:**
```bash
git clone https://github.com/webdevkaleem/uploadthing-ui.git
```
**Create a .env file in the root directory and add the following variables**
```bash
UPLOADTHING_TOKEN=""
```
**Install dependencies**
```bash
pnpm install
```
**Start the development server**
```bash
pnpm run dev
```

## Roadmap
- Expand component functionalities
- Enhance documentation and examples
- Integrate additional features and improvements

## Shadcn Registry
Visit the [shadcn documentation](https://ui.shadcn.com/docs/registry) to view the full documentation.

## Contributing
Contributions are welcome! Please open an issue or submit a PR to help improve the project.

### License
[MIT](https://choosealicense.com/licenses/mit/)
