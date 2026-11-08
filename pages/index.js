import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import PopUpComp from '../components/popUp/PopUpComp'
import Chapters from '../components/navigation/Chapters'
import RuleList from '../components/rules/RuleList'
import Logo from '../components/navigation/logo/Logo'
import { RULES_URL } from '../lib/rules'

//Created by Daniele Johannes Vaccari

//Fetches the rules .txt at build time.
export const getStaticProps = async () => {
  const res = await fetch(RULES_URL)
  const data = await res.text()
  return {
    props: { txtData: data }
  }
}

export default function Home({ txtData }) {

  //Gets all rules from strMagic by using regular expressions.
  const allRules = txtData.match(/^[0-9][0-9][0-9].[0-9][a-z]?.+\s?\s?(Example.*$)?\s?\s?(Example.*$)?\s?\s?(Example.*$)?\s?\s?(Example.*$)?/gm)
  //Gets the chapters and sets them to chapters. Slices the chapter section from .txt file and collects chapters using regex. Indexes of slicing are found by keywords around all chapters.
  const chapters = txtData.slice(txtData.indexOf('Contents'), txtData.indexOf('Credits')).match(/^[0-9][0-9][0-9]\. .+/gm)
  //Hyperlink rule string. Pop up rule.
  const [hyperRule, setHyperRule] = useState('')
  //Bool for search. True if user has entered something in searchbox.
  const [filter, setFilter] = useState(false)
  //Rule identifier. First 3 digits of a rule.
  const [id, setId] = useState('100')
  //Value of searchbox
  const [search, setSearch] = useState('')
  //Boolean for pop up window. Open if true.
  const [openPopUp, setOpenPopUp] = useState(false)

  // If rule contains a rule this will replace it with a hyperlink to that rule. If rule does not contain other rules return the original rule
  const InsertLinksToOtherRuleMentionsInRuleOrReturnRule = (str) => {
    var ruleContainingLinksToOtherRulesIfOtherRulesArePresent = []
    //Search the rule for mentions of other rules and return all rule numbers that are mentioned in an array to ruleIds
    const ruleNumbersInsideARuleInArray = str.match(/[0-9][0-9][0-9]\.?[0-9]?[0-9]?[0-9]?[a-z]?\.?/gm)

    if (ruleNumbersInsideARuleInArray) {
      //First contains the whole rule but if a rule is found inside a this will contain the rule after the ruleId
      var rightSideOfRule = str
      for (var i = 1; i < ruleNumbersInsideARuleInArray.length; i++) {
        //splits rule to left side of the tule number and right side of the rule number
        var stringsAroundExistingRuleNumberInRuleInArray = rightSideOfRule.split(ruleNumbersInsideARuleInArray[i])
        //Adds whole rule together with one rule hyperlink
        ruleContainingLinksToOtherRulesIfOtherRulesArePresent.push(stringsAroundExistingRuleNumberInRuleInArray[0])
        ruleContainingLinksToOtherRulesIfOtherRulesArePresent.push(
          <span key={stringsAroundExistingRuleNumberInRuleInArray[0]}
            data-value={ruleNumbersInsideARuleInArray[i]}
            onClick={ruleHyperOpen} style={{ color: 'blue' }}>
            {ruleNumbersInsideARuleInArray[i]}
          </span>)
        rightSideOfRule = stringsAroundExistingRuleNumberInRuleInArray[1]
        //Returns rule when it has replaced all instances of rules to hyperlink rules in the rule
        if (i + 1 == ruleNumbersInsideARuleInArray.length) {
          ruleContainingLinksToOtherRulesIfOtherRulesArePresent.push(rightSideOfRule)
          return (ruleContainingLinksToOtherRulesIfOtherRulesArePresent)
        }
      }
    }
    return (
      str
    )
  }

  const ruleHyperOpen = (e) => {
    //Gets the data-value attribute that represents the rule's id
    var ruleId = e.target.dataset.value
    //Regular expression to find a exact match for the rule
    const ans = txtData.match(new RegExp(`^${ruleId}\.?.+\s?\s?(Example.*$)?`, 'gm'))[0]
    //Setting values for the pop up
    setHyperRule(ans)
    setOpenPopUp(true)
  }

  return (
    <>
      {/* Title for website */}
      <Head>
        <title>
          Rulebook
        </title>
      </Head>
      {/* Pop up component */}
      <PopUpComp openPopUp={openPopUp} setOpenPopUp={setOpenPopUp} hyperRule={hyperRule} />
      <div className={styles.walls}>
        <Logo />
        {/* Rulebook content */}
        <div className={styles.container}>
          <Chapters setSearch={setSearch} chapters={chapters} setId={setId} search={search} setFilter={setFilter} />
          <RuleList search={search} allRules={allRules} filter={filter} id={id} InsertLinksToOtherRuleMentionsInRuleOrReturnRule={InsertLinksToOtherRuleMentionsInRuleOrReturnRule} />
        </div>
      </div>
    </>
  )
}