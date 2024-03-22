import { useParams } from "react-router-dom";

export function withParams(Component) {
    // eslint-disable-next-line react/display-name
    return props => <Component {...props} params={useParams()} />;
}
  