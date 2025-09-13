import { render, fireEvent } from "@testing-library/react"
import {
  Input,
  InputUnit,
  InputContent,
  InputDecreaseButton,
  InputField,
  InputIncreaseButton,
} from "../ui/input"
import { describe, expect, test, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
  cleanup()
})

describe("Input component", () => {
  test("renders with default value and unit", () => {
    const { getByDisplayValue, getByText } = render(
      <Input value={10} unit="px">
        <InputUnit />
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    expect(getByDisplayValue("10")).not.toBeNull()
    expect(getByText("px")).not.toBeNull()
    expect(getByText("%")).not.toBeNull()
  })

  test("switch unit from px to % and value > 100 resets to 100", () => {
    const { getByDisplayValue, getByText } = render(
      <Input value={120} unit="px">
        <InputUnit />
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    fireEvent.click(getByText("%"))
    expect(getByDisplayValue("100")).not.toBeNull()
  })

  test("decrease button disables at value 0", () => {
    const { getAllByRole } = render(
      <Input value={0} unit="px">
        <InputContent>
          <InputDecreaseButton />
          <InputField />
        </InputContent>
      </Input>
    )
    const btn = getAllByRole("button")[0]
    expect(btn.getAttribute('disabled')).toBe("")
  })

  test("increase button disables at value 100 and unit %", () => {
    const { getAllByRole } = render(
      <Input value={100} unit="%">
        <InputContent>
          <InputIncreaseButton />
          <InputField />
        </InputContent>
      </Input>
    )
    const btn = getAllByRole("button")[0]
    expect(btn.getAttribute('disabled')).toBe("")
  })

  test("input replaces comma with dot and strips invalid chars on blur", () => {
    const { getByRole, getByDisplayValue } = render(
      <Input value={0} unit="px">
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    const input = getByRole("textbox")
    fireEvent.change(input, { target: { value: "12,3a" } })
    fireEvent.blur(input)
    expect(getByDisplayValue("12.3")).not.toBeNull()
  })

  test("input value < 0 resets to 0 on blur", () => {
    const { getByRole, getByDisplayValue } = render(
      <Input value={0} unit="px">
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    const input = getByRole("textbox")
    fireEvent.change(input, { target: { value: "-5" } })
    fireEvent.blur(input)
    expect(getByDisplayValue("0")).not.toBeNull()
  })

  test("input value > 100 and unit % resets to last valid value on blur", () => {
    const { getByRole, getByDisplayValue } = render(
      <Input value={50} unit="%">
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    const input = getByRole("textbox")
    fireEvent.change(input, { target: { value: "150" } })
    fireEvent.blur(input)
    expect(getByDisplayValue("50")).not.toBeNull()
  })

  test("calls onChange when value changes", () => {
    const handleChange = vi.fn()
    const { getByRole } = render(
      <Input value={10} unit="px" onChange={handleChange}>
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    const input = getByRole("textbox")
    fireEvent.change(input, { target: { value: "20" } })
    fireEvent.blur(input)
    expect(handleChange).toHaveBeenCalledWith(20, "px")
  })

  test("calls onChange when unit changes", () => {
    const handleChange = vi.fn()
    const { getByText } = render(
      <Input value={10} unit="px" onChange={handleChange}>
        <InputUnit />
        <InputContent>
          <InputField />
        </InputContent>
      </Input>
    )
    fireEvent.click(getByText("%"))
    expect(handleChange).toHaveBeenCalledWith(10, "%")
  })
})