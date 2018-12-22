import some from "lodash/fp/some";
import map from "lodash/fp/map";
import isEmpty from "lodash/fp/isEmpty";

const newRegExp = (exp) => new RegExp(exp);

const matchRegExp = (url) => (exp) => exp.test(url);

const matchSomeRegExps = (url) => some(matchRegExp(url));

export const getInternalUrlChecker = ({ externalUrlPatterns, internalUrlPatterns }) => {
  const externalExps = map(newRegExp)(externalUrlPatterns || []);
  const internalExps = map(newRegExp)(internalUrlPatterns || []);

  return (url) => {
    const matchesSomeUrls = matchSomeRegExps(url);

    // If the URL *matches any* external URL pattern, then it's external.
    if (!isEmpty(externalExps) && matchesSomeUrls(externalExps)) {
      return false;
    }

    // If the URL *did not match any* internal URL pattern, then it's also external.
    if (!isEmpty(internalExps) && !matchesSomeUrls(internalExps)) {
      return false;
    }

    // Otherwise the URL is internal.
    return true;
  };
};
