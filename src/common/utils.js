// Strip unit (VESTS, STEEM, SBD) from string and return a Number
export const unitString2Number = (stringWithUnit) => Number(stringWithUnit.split(' ')[0])

// Convert vests to Steem
export const vests2Steem = (vestingShares, dynamicGlobalProperties) => {
  const { total_vesting_fund_steem, total_vesting_shares } = dynamicGlobalProperties
  const totalVestingFundSteemNumber = unitString2Number(total_vesting_fund_steem)
  const totalVestingSharesNumber = unitString2Number(total_vesting_shares)
  const vestingSharesNumber = unitString2Number(vestingShares)

  return (totalVestingFundSteemNumber * (vestingSharesNumber / totalVestingSharesNumber)).toFixed(6)
}
