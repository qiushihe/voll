import { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import flattenDeep from "lodash/fp/flattenDeep";
import compact from "lodash/fp/compact";
import size from "lodash/fp/size";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Divider from '@material-ui/core/Divider';

const uncappedMap = map.convert({ cap: false });

const Base = styled.div`
  display: flex;
  flex-direction: column;
`;

const overrideTypographyMargins = () => (`
  margin: 0 10px 10px 10px !important;
`);

const SectionTitle = styled(Typography)`
  ${overrideTypographyMargins()}
`;

const SectionPaper = styled((props) => (
  <Paper {...props} elevation={1} />
))`
  margin: 0 10px 24px 10px;
`;

const overrideListPaddings = () => (`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`);

const ItemsList = styled(List)`
  ${overrideListPaddings()}
`;

const flattenArray = (maybeArray) => flattenDeep([maybeArray]);

class Section extends PureComponent {
  render() {
    const { title, children } = this.props;

    return (
      <Base>
        <SectionTitle>
          {title}
        </SectionTitle>
        <SectionPaper>
          <ItemsList>
            {flow([
              flattenArray,
              (childrenArray) => {
                return uncappedMap((child, index) => ([
                  child,
                  (
                    index < size(childrenArray) - 1
                      ? <Divider />
                      : null
                  )
                ]))(childrenArray);
              },
              flattenArray,
              compact,
              (items) => Children.toArray(items)
            ])(children)}
          </ItemsList>
        </SectionPaper>
      </Base>
    );
  }
}

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

Section.defaultProps = {
  title: "Section",
  children: null
};

export default Section;
