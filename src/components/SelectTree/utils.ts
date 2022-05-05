import type { SelectionStatus, SelectTreeNodeProps } from '#src/components/SelectTree/SelectTreeNode';

type Status = SelectionStatus | undefined;

const defineBranchStatus = (childrenStatus: Status[]) => {
  if (childrenStatus.length === 0) return undefined;
  if (childrenStatus.every((status) => status === 'unchecked')) return 'unchecked';
  if (childrenStatus.every((status) => status === 'checked')) return 'checked';
  return 'indeterminate';
};

export const updateNodeStatus = (root: SelectTreeNodeProps[]) => {
  const checkedBranches: Status[] = root
    .map((branch) => {
      let branchStatus: Status;
      if (branch.children) {
        branchStatus = updateNodeStatus(branch.children);
        if ('status' in branch && branchStatus) {
          branch.status = branchStatus;
        }
      } else {
        if ('status' in branch) {
          branchStatus = branch.status;
        }
      }
      return branchStatus;
    })
    .filter((item) => item);

  return defineBranchStatus(checkedBranches);
};
