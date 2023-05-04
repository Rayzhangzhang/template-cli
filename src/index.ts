import prompts from 'prompts'

const init = async () => {
  const result = await prompts([
    {
      name: 'projectName',
      type: 'text',
      message: 'Project name:',
      initial: '111',
    },
  ])
  console.log(result)
}

init().catch((e) => {
  console.error(e)
})
