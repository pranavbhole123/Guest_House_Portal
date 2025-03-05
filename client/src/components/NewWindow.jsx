function NewWindow({link}) {
  // Define the size and other options for the new window
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const options = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
console.log("here")
  // Open the new window with the specified options
  const newWindow = window.open("", "_blank", options);

  // Optionally, load content into the new window
  newWindow.document.location.href = link;
}

export default NewWindow;
