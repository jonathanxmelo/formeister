import React from 'react'
import propKeysForFields from './formStaticPropKeys'

const Forme = (props) => {

  let propsFormState = props.formState ?
    {...props.formState} : {fields: {}, touched: []}

  const updateState = ({e, formState}) => {
    formState = formState || propsFormState
    formState.fields = formState.fields || {}
    let formStateField = formState.fields[e.target.name]
    if (e.target.multiple) {
      if (formStateField && formStateField.includes(e.target.value)) {
        formStateField = formStateField.filter(val => val !== e.target.value)
      }else{
        formStateField ?
          formStateField.push(e.target.value) : formStateField = [e.target.value]
      }

      formState.fields[e.target.name] = formStateField
    }else if (e.target.type === 'checkbox') {
      formState.fields[e.target.name] = e.target.checked
    }else if (e.target.type === 'radio') {
      formState.fields[e.target.name] = e.target.value
    }else{
      formState.fields[e.target.name] = e.target.value
    }
    props.setFormState(formState)
  }

  const addTouchedField = ({e, formState}) => {
    formState = formState || propsFormState
    formState.touched = formState.touched || []
    const name = e.target.name
    if (!formState.touched.includes(name)) formState.touched.push(name)
    props.setFormState(formState)
  }

  const onChange = (e, func = null) => {
    let obj = {}
    if (func) {
      obj = func(e, propsFormState)
    }
    if (props.allOnChange){
      obj = props.allOnChange(e, obj.formState || propsFormState)
    }
    updateState({e, ...obj})
  }

  const onBlur = (e, func = null) => {
    let obj = {}
    if (func) {
      obj = func(e, propsFormState)
    }
    if (props.allOnBlur){
      obj = props.allOnBlur(e, obj.formState || propsFormState)
    }
    addTouchedField({e, ...obj})
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
        defaultValues['checked'] = propsFormState.fields[child.props.name] || false
      }else if (child.props.type === 'radio') {
        defaultValues['value'] = child.props.value
      }else if (propsFormState.fields[child.props.name]) {
        defaultValues['value'] = propsFormState.fields[child.props.name]
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
