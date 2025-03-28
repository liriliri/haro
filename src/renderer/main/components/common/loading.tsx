import { LoadingBar } from 'share/renderer/components/loading'

interface ILoadingProps {
  className?: string
  onClick?: () => void
}

export const PannelLoading = function (props: ILoadingProps) {
  return (
    <div className="panel-loading" onClick={props.onClick}>
      <LoadingBar />
    </div>
  )
}
