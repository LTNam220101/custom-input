import { Input, InputContent, InputDecreaseButton, InputField, InputIncreaseButton, InputUnit } from "./ui/input"
import * as React from "react"

const App = () => {
  const [value, setValue] = React.useState(50)
  const [unit, setUnit] = React.useState<"px" | "%">("%")

  const onChange = (v: number, u: "px" | "%") => {
    setValue(v)
    setUnit(u)
  }

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg">
        <Input
          value={value}
          unit={unit}
          onChange={onChange}
        >
          <InputUnit />
          <InputContent>
            <InputDecreaseButton />
            <InputField />
            <InputIncreaseButton />
          </InputContent>
        </Input>
      </div>
    </div>
  )
}

export default App
