import React from 'react'
import propKeysForFields from './formStaticPropKeys'

const Forme = (props) => {

  let propsFormState = props.formState.values && props.formState.touched ?
    {...props.formState} : {fields: {}, touched: []}

  const updateState = (target) => {
    let formState = propsFormState
    formState.values = formState.values || {}
    let formStateField = formState.values[target.name]
    if (target.multiple) {
      if (formStateField && formStateField.includes(target.value)) {
        // Deselect
        formStateField = formStateField.filter(val => val !== target.value)
      }else{
        formStateField ?
          formStateField.push(target.value) : formStateField = [target.value]
      }

      formState.values[target.name] = formStateField
    }else if (target.type === 'checkbox') {
      formState.values[target.name] = target.checked
    }else if (target.type === 'radio') {
      formState.values[target.name] = target.value
    }else{
      formState.values[target.name] = target.value
    }
    props.setFormState(formState)
  }

  const addTouchedField = (target) => {
    let formState = formState || propsFormState
    formState.touched = formState.touched || []
    const name = target.name
    if (!formState.touched.includes(name)) formState.touched.push(name)
    props.setFormState(formState)
  }

  const onChange = (e, func = null) => {
    if (props.allOnChange){
      props.allOnChange(e, propsFormState, props.setFormState)
    }
    if (func) {
      func(e, propsFormState, props.setFormState)
    }
    updateState(e.target)
  }

  const onBlur = (e, func = null) => {
    if (props.allOnBlur){
      props.allOnBlur(e, propsFormState, props.setFormState)
    }
    if (func) {
      func(e, propsFormState, props.setFormState)
    }
    addTouchedField(e.target)
  }

  const processChildren = (children) => {
    return React.Children.map(children, child => {
      if (!child.props) return child
      if (typeof child.props.children === 'object') {
        const children = processChildren(child.props.children)
        child = React.createElement(child.type, {...child.props, ...{children}})
      }

      let defaultValues = {}

      if (child.props.type === 'checkbox') {
        defaultValues['checked'] = propsFormState.values[child.props.name] || false
      }else if (child.props.type === 'radio') {
        defaultValues['value'] = child.props.value
      }else if (propsFormState.values[child.props.name]) {
        defaultValues['value'] = propsFormState.values[child.props.name]
      }else if (child.props.multiple) {
        defaultValues['value'] = []
      }else{
        defaultValues['value'] = ''
      }

      const spread = {
        ...defaultValues,
        onChange: (e => onChange(e, child.props.onChange)),
        onBlur: (e => onBlur(e, child.props.onBlur))
      }

      const ctrlableElements = ['input', 'textarea', 'select', 'datalist']
      const childProps = ctrlableElements.includes(child.type) ?
        {...child.props, ...spread} : {...child.props}

      let wrap
      if (child.props.wrap === false) {
        wrap = false
      }else{
        wrap = child.props.wrap ? child.props.wrap : props.wrap
      }
      delete childProps.wrap

      const wrappableElements = ['input', 'textarea', 'select', 'datalist']
      const wrappable = wrappableElements.includes(child.type)

      let Component
      if (wrappable) {
        Component = (props) => {
          const fieldProps = {...props}
          if (fieldProps.appendClass) {
            childProps.className = childProps.className + ' ' + fieldProps.appendClass
            delete fieldProps.appendClass
          }
          return React.createElement(child.type, {...childProps, ...fieldProps})
        }
      }

      if (ctrlableElements.includes(child.type)) {
        return wrap && wrappable ? wrap(Component, propsFormState) : Component()
      }else{
        return child
      }

    });

  }

  const children = processChildren(props.children)
  
  let formProps = {...props, onSubmit: (e => props.onSubmit(e, props.formState, props.setFormState))}
  propKeysForFields.forEach(key => delete formProps[key])
  return <form {...formProps}>{children}</form>
}

export default Forme
