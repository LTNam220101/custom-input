import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

export type InputValueType = {
  unit: "px" | "%"
  value: number
  setUnit?: (unit: "px" | "%") => void
  setValue?: (value: number) => void
}
const InputValueContext = React.createContext<InputValueType>({
  unit: "%",
  value: 0,
})
const useInputValueContext = () => React.useContext(InputValueContext)

export type InputUIType = {
  isHovered?: boolean
  setIsHovered?: React.Dispatch<React.SetStateAction<boolean>>
  isFocused?: boolean
  setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>
}
const InputUIContext = React.createContext<InputUIType>({})
const useInputUIContext = () => React.useContext(InputUIContext)

const unitVariants = cva("w-[67px] h-8 text-center leading-8 cursor-pointer", {
  variants: {
    variant: {
      active: "text-[#F9F9F9]",
      inActive: "text-[#AAAAAA]",
    },
  },
  defaultVariants: {
    variant: "active",
  },
})

const InputUnit = ({
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof unitVariants>) => {
  const { unit, setUnit } = useInputValueContext()
  return (
    <div
      className={cn(
        "relative flex gap-[2px] text-xs text-[#AAAAAA] p-[2px] w-fit bg-[#212121] rounded-lg",
        className
      )}
      {...props}
    >
      {/* Overlay background */}
      <div
        className={cn(
          "absolute top-0 left-0 m-[2px] h-8 w-[67px] rounded-md transition-transform duration-300 bg-[#424242] z-0",
          unit === "%" ? "translate-x-0" : "translate-x-[69px]"
        )}
        style={{ willChange: "transform" }}
      />
      <div
        className={cn(
          "relative z-1",
          unitVariants({ variant: unit === "px" ? "inActive" : "active" })
        )}
        onClick={() => setUnit?.("%")}
        style={{ userSelect: "none" }}
      >
        %
      </div>
      <div
        className={cn(
          "relative z-1",
          unitVariants({ variant: unit === "px" ? "active" : "inActive" })
        )}
        onClick={() => setUnit?.("px")}
        style={{ userSelect: "none" }}
      >
        px
      </div>
    </div>
  )
}

const InputContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { isHovered, isFocused } = useInputUIContext()

  return (
    <div
      className={cn(
        "bg-[#212121] text-[#F9F9F9] rounded-md transition-all w-max flex",
        isHovered && "bg-[#3B3B3B]",
        isFocused && "outline outline-[#3C67FF]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const InputDecreaseButton = ({
  className,
  tooltipContent = "Value must greater than 0",
  ...props
}: React.ComponentProps<"button"> & { tooltipContent?: string }) => {
  const [openTooltip, setOpenTooltip] = React.useState(false)
  const { value, setValue } = useInputValueContext()

  const disabled = value === 0
  
  const handleDecrease = () => {
    setValue?.(Math.max(value - 1, 0))
  }
  return (
    <span
      onMouseEnter={() => {
        if (disabled) {
          setOpenTooltip(true)
        }
      }}
      onMouseLeave={() => setOpenTooltip(false)}
    >
      <button
        disabled={disabled}
        onClick={handleDecrease}
        className={cn(
          "p-2 bg-transparent hover:bg-[#3B3B3B] disabled:hover:bg-transparent disabled:[&>[data-icon]>path]:fill-[#AAAAAA] rounded-l-md relative",
          className
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          data-icon
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 9.75C4 9.33579 4.33579 9 4.75 9L15.25 9C15.6642 9 16 9.33579 16 9.75C16 10.1642 15.6642 10.5 15.25 10.5H4.75C4.33579 10.5 4 10.1642 4 9.75Z"
            fill="#F9F9F9"
          />
        </svg>
        {disabled && openTooltip && (
          <>
            <div className="absolute font-normal text-xs px-2 py-[3px] rounded-lg bg-[#212121] w-max bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-2">
              {tooltipContent}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="4"
              viewBox="0 0 9 4"
              fill="none"
              className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2"
            >
              <path
                d="M8.5 6.99382e-07L4.5 4L0.5 0L8.5 6.99382e-07Z"
                fill="#212121"
              />
            </svg>
          </>
        )}
      </button>
    </span>
  )
}

const InputIncreaseButton = ({
  className,
  tooltipContent = "Value must smaller than 100",
  ...props
}: React.ComponentProps<"button"> & { tooltipContent?: string }) => {
  const [openTooltip, setOpenTooltip] = React.useState(false)
  const { value, unit, setValue } = useInputValueContext()

  const disabled = unit === "%" ? value >= 100 : false

  const handleIncrease = () => {
    if (unit === "%") {
      setValue?.(Math.min(value + 1, 100))
    }
    if (unit === "px") {
      setValue?.(value + 1)
    }
  }
  return (
    <span
      onMouseEnter={() => {
        if (disabled) {
          setOpenTooltip(true)
        }
      }}
      onMouseLeave={() => setOpenTooltip(false)}
    >
      <button
        disabled={disabled}
        className={cn(
          "p-2 bg-transparent hover:bg-[#3B3B3B] disabled:hover:bg-transparent disabled:[&>[data-icon]>path]:fill-[#AAAAAA] rounded-r-md relative",
          className
        )}
        onClick={handleIncrease}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          data-icon
        >
          <path
            d="M10.75 4.75C10.75 4.33579 10.4142 4 10 4C9.58579 4 9.25 4.33579 9.25 4.75V9.25H4.75C4.33579 9.25 4 9.58579 4 10C4 10.4142 4.33579 10.75 4.75 10.75H9.25L9.25 15.25C9.25 15.6642 9.58579 16 10 16C10.4142 16 10.75 15.6642 10.75 15.25V10.75H15.25C15.6642 10.75 16 10.4142 16 10C16 9.58579 15.6642 9.25 15.25 9.25H10.75V4.75Z"
            fill="#F9F9F9"
          />
        </svg>
        {disabled && openTooltip && (
          <>
            <div className="absolute font-normal text-xs px-2 py-[3px] rounded-lg bg-[#212121] w-max bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-2">
              {tooltipContent}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="4"
              viewBox="0 0 9 4"
              fill="none"
              className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2"
            >
              <path
                d="M8.5 6.99382e-07L4.5 4L0.5 0L8.5 6.99382e-07Z"
                fill="#212121"
              />
            </svg>
          </>
        )}
      </button>
    </span>
  )
}

const InputField = ({ className, ...props }: React.ComponentProps<"input">) => {
  const { unit, value, setValue } = useInputValueContext()
  const { setIsFocused, setIsHovered } = useInputUIContext()
  const [inputValue, setInputValue] = React.useState<string>(String(value))
  const [lastValidValue, setLastValidValue] = React.useState<number>(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(",", "."))
  }

  const handleBlur = () => {
    const match = inputValue.match(/-?\d+(\.\d+)?/)
    let num = match ? parseFloat(match[0]) : 0
    if (isNaN(num)) num = 0
    if (num < 0) num = 0
    if (unit === "%" && num > 100) num = lastValidValue
    setInputValue(String(num))
    setValue?.(num)
    setIsFocused?.(false)
  }

  React.useEffect(() => {
    if (
      (unit === "%" && value >= 0 && value <= 100) ||
      (unit === "px" && value >= 0)
    ) {
      setLastValidValue(value)
    }
    setInputValue(String(value))
  }, [value, unit])

  return (
    <input
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleBlur()
        }
      }}
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
      onFocus={() => setIsFocused?.(true)}
      className={cn(
        "text-[#F9F9F9] text-xs rounded-md p-2 w-17 focus-visible:outline-none text-center",
        className
      )}
      {...props}
    />
  )
}

type InputProps = Omit<React.ComponentProps<"input">, "onChange"> &
  Partial<InputValueType> & {
    children?: React.ReactNode
    onChange?: (value: number, unit: "px" | "%") => void
  }

const Input = ({
  unit = "%",
  value = 0,
  children,
  onChange,
  ...rest
}: InputProps) => {
  const [currentUnit, setCurrentUnit] = React.useState<"px" | "%">(unit)
  const [currentValue, setCurrentValue] = React.useState<number>(value)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSetUnit = (nextUnit: "px" | "%") => {
    let newValue = currentValue
    if (nextUnit === "%" && currentValue > 100) {
      newValue = 100
    }
    onChange?.(newValue, nextUnit)
    setCurrentUnit(nextUnit)
    setCurrentValue(newValue)
  }

  const handleSetValue = (val: number) => {
    onChange?.(val, currentUnit)
    setCurrentValue(val)
  }

  return (
    <InputValueContext.Provider
      value={{
        unit: currentUnit,
        value: currentValue,
        setUnit: handleSetUnit,
        setValue: handleSetValue,
      }}
    >
      <InputUIContext.Provider
        value={{
          isHovered,
          setIsHovered,
          isFocused,
          setIsFocused,
        }}
      >
        <div className="space-y-4" {...rest}>
          {children}
        </div>
      </InputUIContext.Provider>
    </InputValueContext.Provider>
  )
}

export {
  Input,
  InputUnit,
  InputContent,
  InputDecreaseButton,
  InputField,
  InputIncreaseButton,
}
