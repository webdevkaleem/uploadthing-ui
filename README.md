# Uploadthing UI

Custom UI components for Uploadthing built on top of the [Shadcn Registry](https://ui.shadcn.com/docs/registry). This project is for [Next JS](https://nextjs.org/)/[React](https://react.dev/) only. It's an opinionated way of handling uploadthing's client side state.

## Technologies Used

- [**Tailwind CSS**](https://tailwindcss.com/) for rapid, responsive styling
- [**Shadcn**](https://ui.shadcn.com/) for a beautiful, consistent UI
- [**Zustand**](https://zustand.docs.pmnd.rs/getting-started/introduction) for state management
- [**Lucide-react**](https://lucide.dev/) for iconography
- [**Cuid2**](https://github.com/paralleldrive/cuid2) for generating unique IDs

<br/>

## Showcase [1]
Workflow: Inside the uploadthing&apos;s admin dashboard

**Installation**
```bash
pnpm dlx shadcn@latest add https://uploadthing-ui.vercel.app/r/button-uploadthing.json
```
**Usage**
```javascript
// add inside your layout.tsx

<Toaster expand theme="system" gap={8} />
```
```javascript
// add inside a client component

<UTUIButtonUploadthing
  UTUIFunctionsProps={{
    // add the file route which you want to use
    // ps. fileRoute isn't typesafe
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
**Usage**
```javascript
// add inside a client component

<UTUIButtonProton
  UTUIFunctionsProps={{
    // add the file route which you want to use
    // ps. fileRoute isn't typesafe
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
