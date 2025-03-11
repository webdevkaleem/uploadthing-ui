# Uploadthing UI Components

Custom UI components for Uploadthing built on top of the [shadcn registry]. This project leverages a modern tech stack to help you get a basic scaffold up and running quickly.

## Showcase [1]
**Installation**
```bash
pnpm dlx shadcn@latest add https://uploadthing-ui.vercel.app/r/button-uploadthing.json
```
**Usage**
```javascript
// add inside a client component

<UTUIButtonUploadthing
  UTUIFunctionsProps={{
    onBeforeUploadBegin: (files) => {
      // Your additional code here

      return files;
    },
    onUploadBegin: (fileName) => {
      // Your additional code here
    },
    onUploadProgress: (progress) => {
      // Your additional code here
    },
    onClientUploadComplete: (res) => {
      // Your additional code here
    },
    onUploadError: (error) => {
      // Your additional code here
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
    onBeforeUploadBegin: (files) => {
      // Your additional code here

      return files;
    },
    onUploadBegin: (fileName) => {
      // Your additional code here
    },
    onUploadProgress: (progress) => {
      // Your additional code here
    },
    onClientUploadComplete: (res) => {
      // Your additional code here
    },
    onUploadError: (error) => {
      // Your additional code here
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
