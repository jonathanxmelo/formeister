Avoid the formache that comes with building forms in React. Formeister uses React Hooks to provide a shockingly simple pattern for creating forms. Formeister handles form state in a way that gives you complete control as if you rolled your very own library. 

Easily accessible and manipulable form state is important but so is form layout readability. Code readability is where Formeister really seperates itself from the rest. A special "wrap" prop is available on form elements that make code reuse and composability a dream. 

Styling form elements beautifully require a lot of HTML boilerplate code. Now you can take that surrounding code and pass it as a prop using the Render Prop pattern. 



# Code Playground Examples
React Forms with Formeister Demo: https://codesandbox.io/embed/pm5y87x4z0

# Get Started

npm install formeister

```
import React, { useState } from "react";
import Forme from "formeister";

function App() {
    const [formState, setFormState] = useState();

    function onSubmit(e, formState, setFormState) {
        e.preventDefault()
        // validate formState & send
    }

    return (
        <Forme formState={formState} setFormState={setFormState} onSubmit={onSubmit}>
            // name property must be unique and is required in order to be managed by formState
            <input type="text" name='fname' placeholder="First Name" />
            <input type="text" name='lname' placeholder="Last Name" />
            <button type="submit">Send</button>
        </Forme>
    )
}
```



