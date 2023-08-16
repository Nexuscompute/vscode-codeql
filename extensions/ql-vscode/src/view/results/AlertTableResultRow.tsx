import * as React from "react";
import * as Sarif from "sarif";
import * as Keys from "./result-keys";
import { info, listUnordered } from "./octicons";
import { ScrollIntoViewHelper } from "./scroll-into-view-helper";
import { selectableZebraStripe } from "./result-table-utils";
import { AlertTableDropdownIndicatorCell } from "./AlertTableDropdownIndicatorCell";
import { useMemo } from "react";
import { SarifLocation } from "./locations/SarifLocation";

interface Props {
  result: Sarif.Result;
  resultIndex: number;
  currentResultExpanded: boolean;
  selectedItem: undefined | Keys.ResultKey;
  databaseUri: string;
  sourceLocationPrefix: string;
  updateSelectionCallback: (
    resultKey: Keys.PathNode | Keys.Result | undefined,
  ) => () => void;
  toggler: (keys: Keys.ResultKey[]) => (e: React.MouseEvent) => void;
  scroller: ScrollIntoViewHelper;
  msg: JSX.Element;
}

export function AlertTableResultRow(props: Props) {
  const {
    result,
    resultIndex,
    currentResultExpanded,
    selectedItem,
    databaseUri,
    sourceLocationPrefix,
    updateSelectionCallback,
    toggler,
    scroller,
    msg,
  } = props;

  const resultKey: Keys.Result = useMemo(
    () => ({ resultIndex }),
    [resultIndex],
  );

  const handleSarifLocationClicked = useMemo(
    () => updateSelectionCallback(resultKey),
    [resultKey, updateSelectionCallback],
  );
  const handleDropdownClick = useMemo(() => {
    const indices =
      Keys.getAllPaths(result).length === 1
        ? [resultKey, { ...resultKey, pathIndex: 0 }]
        : /* if there's exactly one path, auto-expand
           * the path when expanding the result */
          [resultKey];
    return toggler(indices);
  }, [result, resultKey, toggler]);

  const resultRowIsSelected =
    selectedItem?.resultIndex === resultIndex &&
    selectedItem.pathIndex === undefined;

  return (
    <tr
      ref={scroller.ref(resultRowIsSelected)}
      {...selectableZebraStripe(resultRowIsSelected, resultIndex)}
      key={resultIndex}
    >
      {result.codeFlows === undefined ? (
        <>
          <td className="vscode-codeql__icon-cell">{info}</td>
          <td colSpan={3}>{msg}</td>
        </>
      ) : (
        <>
          <AlertTableDropdownIndicatorCell
            expanded={currentResultExpanded}
            onClick={handleDropdownClick}
          />
          <td className="vscode-codeql__icon-cell">{listUnordered}</td>
          <td colSpan={2}>{msg}</td>
        </>
      )}
      <td className="vscode-codeql__location-cell">
        {result.locations && result.locations.length > 0 && (
          <SarifLocation
            loc={result.locations[0]}
            sourceLocationPrefix={sourceLocationPrefix}
            databaseUri={databaseUri}
            onClick={handleSarifLocationClicked}
          />
        )}
      </td>
    </tr>
  );
}
