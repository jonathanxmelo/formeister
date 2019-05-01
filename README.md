Avoid the formache that comes with building forms in React. Formeister uses React Hooks to provide a shockingly simple pattern for creating forms. Formeister handles form state in a way that gives you complete control as if you rolled your very own library. 

Easily accessible and manipulable form state is important but so is code readability. Maintainability is where Formeister really seperates itself from the rest. A special "wrap" prop is available on form elements that make code reuse and composability a dream.

Styling form elements beautifully require a lot of HTML boilerplate code. Now you can take that surrounding code and pass it as a prop using the Render Prop pattern. 



# Code Playground Examples
Basic Form Demo: https://codesandbox.io/embed/pm5y87x4z0

Form Validation Demo: https://codesandbox.io/embed/0p3zvn7240

# Wraps
Formeister Wraps are a great way to manage boilerplate code around form elements. 
You can reuse Wraps for popular CSS frameworks that are already built by the community.

Learn more at https://formeister.com/wraps

# Documentation: https://formeister.com

```
npm install formeister
```

```
import React, { useState } from "react";
import Forme from "formeister";

function App() {
    const [formState, setFormState] = useState();

    function handleOnSubmit(e, formState, setFormState) {
        e.preventDefault()
        // validate formState & send
    }

    return (
        <Forme formState={formState} setFormState={setFormState} onSubmit={handleOnSubmit}>
            // name property must be unique and is required in order to be managed by formState
            <input type="text" name='fname' placeholder="First Name" />
            <input type="text" name='lname' placeholder="Last Name" />
            <button type="submit">Send</button>
        </Forme>
    )
}
```



