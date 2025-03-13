# Uploadthing UI

Custom UI components for Uploadthing built on top of the [Shadcn Registry](https://ui.shadcn.com/docs/registry). This project is for [Next JS](https://nextjs.org/)/[React](https://react.dev/) only. It's an opinionated way of handling uploadthing's client side state.

<br/>

## Technologies Used

- [**Tailwind CSS**](https://tailwindcss.com/) for rapid, responsive styling
- [**Shadcn**](https://ui.shadcn.com/) for a beautiful, consistent UI
- [**Zustand**](https://zustand.docs.pmnd.rs/getting-started/introduction) for state management
- [**Lucide-react**](https://lucide.dev/) for iconography
- [**Cuid2**](https://github.com/paralleldrive/cuid2) for generating unique IDs

<br/>

## Project Structure
This project structure will be used upon installation of the components. This is just for reference
```
│
├───api
│   └───uploadthing
│   |    └───core.ts  
│   |    └───route.ts  
└───components
│   └───uploadthing-ui
│   |    └─── ...
└───lib
│   └───uploadthing-ui-types.ts 
│   └───uploadthing-ui-utils.ts 
│   └───uploadthing.ts 
└───store 
│   └─── ...
│

```

<br/>

## Usage
Create a .env file in the root directory and add the following variables
```bash
UPLOADTHING_TOKEN=""
```
Steps to follow from uploadthing's documentation
- [Create your first file router](https://docs.uploadthing.com/getting-started/appdir#creating-your-first-file-route)
- [Create a Next.js API route using your file router](https://docs.uploadthing.com/getting-started/appdir#create-a-next-js-api-route-using-the-file-router)
- The [UploadThing Components](https://docs.uploadthing.com/getting-started/appdir#create-the-upload-thing-components) are generated automatically (with the required changes) when installing from this registry

<br>

## Showcase [1]
Workflow: Inside the uploadthing&apos;s admin dashboard

**Installation**
```bash
pnpm dlx shadcn@latest add https://uploadthing-ui.vercel.app/r/button-uploadthing.json
```

Add inside your `layout.tsx`
```javascript
import { Toaster } from "@/components/ui/sonner";
```
```javascript
<Toaster expand theme="system" gap={8} />
```
Add inside of a `client` component
```javascript
import UTUIButtonUploadthing from "@/components/uploadthing-ui/button-uploadthing";
```
```javascript
// add the fileRoute which you want to use
// ps. fileRoute isn't typesafe
<UTUIButtonUploadthing
  UTUIFunctionsProps={{
    fileRoute: "imageUploader",
    onBeforeUploadBegin: (files) => {
      // Your additional code here
      console.log(files);

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

<br/>

## Showcase [2]
Workflow: Inside storage drive applications

**Installation**
```bash
pnpm dlx shadcn@latest add https://uploadthing-ui.vercel.app/r/button-generic-drive.json
```

Add inside of a `client` component
```javascript
import UTUIButtonGenericDrive from "@/components/uploadthing-ui/button-generic-drive";
```
```javascript
// add the fileRoute which you want to use
// ps. fileRoute isn't typesafe
<UTUIButtonGenericDrive
  UTUIFunctionsProps={{
    fileRoute: "imageUploader",
    onBeforeUploadBegin: (files) => {
      // Your additional code here
      console.log(files);

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

<br/>

## Installation of the Registry

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

<br/>

## Roadmap
- Expand component functionalities
- Enhance documentation and examples
- Integrate additional features and improvements

<br/>

## Shadcn Registry
Visit the [shadcn documentation](https://ui.shadcn.com/docs/registry) to view the full documentation.

<br/>

## Contributing
Contributions are welcome! Please open an issue or submit a PR to help improve the project.

<br/>

### License
[MIT](https://choosealicense.com/licenses/mit/)
