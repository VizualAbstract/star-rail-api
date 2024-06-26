### Star Rail API

[Star Rail API](https://github.com/VizualAbstract/star-rail-api) provides a query builder specifically tailored to use with [StarRailStaticAPI](https://github.com/vizualabstract/StarRailStaticAPI), providing a variety of methods to join and enrich the data.

## Query Builders

### CharacterQuery

The Character Query is used to fetch data from [characters.json](https://vizualabstract.github.io/StarRailStaticAPI/db/en/characters.json).

```javascript
import { CharacterQuery } from 'star-rail-api';
```

## Class configuration

The builder will accept an optional configuration object that you can use to overwrite default values.

**Example**

```
const query = CharacterQuery({
  baseURL: '',
  assetURL: '',
  language: 'en',
})
```

**Options**

- baseURL - URL to the db directory for StarRailStaticAPI.
- assetUrl - URL to the asset directory for StarRailStaticAPI.
- language - Language to source the db files from StarRailStaticAPI. See [#language](#language) section.
- cache - Axios Cache Interceptor settings. See [axios-cache-interceptor#config](https://axios-cache-interceptor.js.org/config)

## Client methods

**Modifiers**

- `withRanks` - Appends characters rank data from `characters_ranks.json` as `_ranks`
- `withSkills` - Appends character skill data from `characters_skills.json` as `_skills`
- `withSkillTrees` - Appends character skill tree data from `characters_skill_trees.json` as `_skill_trees`
- `withImages` - Include full image and icon paths in the response.

**Retrievers**

- `get` - Returns a dictionary of all characters with their string ID as a key.
- `getByID` - Returns or fails with the provided character ID.
- `getByName` - Returns or fails with the provided character name.
- `list` - Returns a list of all characters.

**Example**

```javascript
import { CharacterIDs, CharacterQuery } from 'star-rail-api';

const characters = new CharacterQuery();

characters
  .withRanks()
  .withSkills()
  .withSkillTrees()
  .withImages()
  .getByID(CharacterIDs.DanHengImbibitorLunae)
  .then((resp) => {
    window.console.log(resp);
  })
  .catch((error) => {
    window.console.error(error);
  });
```


## Using Builders

The ensuing illustrations will address the various kinds of functionalities available within the `CharacterQuery` class. This builder facilitates interaction with [characters.json](https://vizualabstract.github.io/StarRailStaticAPI/db/en/characters.json).

Every builder will comprise either methods designed for adjusting the query (modifying) or for retrieving the data.

Hence, we will classify them as either **Modifiers** or **Retrievers**.

### Retriever methods

Retrievers are functions that offer a means to perform a retrieval operation. They will reply with the requested information, but the output format could vary based on the specific retriever used, such as a dictionary, an object, a list, or an error message.

Although every builder will support standard `get` and `list` retriever functionalities, certain builders like the `CharacterQuery` may have additional specialized methods for accessing data by ID or Name.

**get()**

The `get()` method allows direct access to the raw JSON object by returning a dictionary with IDs as keys.

**Example**

```javascript
import { CharacterQuery } from 'star-rail-api';

const query = new CharacterQuery();

query.get().then((resp) => { console.log(resp) });

// Response
{
  "1001": {
    id: "1001",
    name: "March 7th",
    rarity: 4,
    path: "Knight",
    element: "Ice",
    ranks: [
      "100101",
      "100102",
    ],
    icon: "icon/character/1001.png",
    portrait: "image/character_portrait/1001.png"
  },
  "1002": {
    id: "1002",
    name: "Dan Heng",
    rarity: 4,
    path: "Rogue",
    element: "Wind",
    ranks: [
      "100201",
      "100202",
    ],
    icon: "icon/character/1002.png",
    portrait: "image/character_portrait/1002.png"
  }
}
```

**list()**

On the other hand, the `list()` method will return the values as an array.

**Example**

```
[
  {
    id: "1001",
    name: "March 7th",
    rarity: 4,
    path: "Knight",
    element: "Ice",
    ranks: [
      "100101",
      "100102",
    ],
    icon: "icon/character/1001.png",
    portrait: "image/character_portrait/1001.png"
  },
  {
    id: "1002",
    name: "Dan Heng",
    rarity: 4,
    path: "Rogue",
    element: "Wind",
    ranks: [
      "100201",
      "100202",
    ],
    icon: "icon/character/1002.png",
    portrait: "image/character_portrait/1002.png"
  }
]
```

**getByName(string)**

The `CharacterQuery` has a special method you wont find on all builders. Using `getByName`, you can can fetch specific characters by their name property.

**Example**

```javascript
import { CharacterQuery } from 'star-rail-api';

const query = new CharacterQuery();

query
  .getByName('Himeko')
  .then((resp) => { console.log(resp) });

// Response
{
  id: "1003",
  name: "Himeko",
  rarity: 5,
  path: "Mage",
  element: "Fire",
  ranks: [
    "100301",
    "100302",
  ],
  icon: "icon/character/1003.png",
  portrait: "image/character_portrait/1003.png"
}
```

### Modifier methods

Modifiers are chainable methods that provide users with a way of manipulating data.

In the example above, you can see that ranks returns a list of IDs. These are references to entries in the [character_ranks.json](https://vizualabstract.github.io/StarRailStaticAPI/db/en/character_ranks.json) file.

While you can invoke the `CharacterRanksClient` class to retrieve that information, you can use modifiers on the `CharacterQuery` to automatically retrieve and include that data when you invoke your exectuer method.

Keep in mind, most modifiers that retrieve additional property data will will append its responseto the data object, not replace the original property value:

**withRanks**

```javascript
import { CharacterQuery, CharactersByID } from 'star-rail-api';

new CharacterQuery()
  .withRanks()
  .getByName(CharactersByID.SilverWolf)
  .then((resp) => {
    console.log(resp);
  });

// Response
{
  id: "1003",
  name: "Silver Wolf",
  rarity: 5,
  path: "Warlock",
  element: "Quantum",
  ranks: [
    "100601",
    "100602",
  ],
  skills: [
    "10011",
    "10012"
  ],
  skill_trees: [
    "1222012",
    "1222013",
  ],
  icon: "icon/character/1003.png",
  portrait: "image/character_portrait/1003.png"
  _ranks: [
    {
      id: "100601",
      name: "Social Engineering",
      rank: 1,
      desc: "After using her Ultimate to attack enemies, Silver Wolf regenerates 7 Energy for every debuff that the target enemy currently has. This effect can be triggered up to 5 time(s) in each use of her Ultimate.",
      icon: "icon/skill/1006_rank1.png"
    },
    {
      id: "100602",
      name: "Zombie Network",
      rank: 2,
      desc: "When an enemy enters battle, reduces their Effect RES by 20%.",
      materials: [
        {
          id: "11006",
          num: 1
        }
      ],
      icon: "icon/skill/1006_rank2.png"
    }
  ]
}
```

#### withImages()

One exception to the modifiers mentioned above is the `withImages()` method, which instead of appending images to the object, will actually inject a full URL path to the value.

[StarRailStaticAPI](https://vizualabstract.github.io/StarRailStaticAPI/) also has access to images, and therefore, so do Star Rail API builders. Others, the default behavior is to return images with only the file path.

```javascript
import { CharacterQuery, CharactersByID } from 'star-rail-api';

new CharacterQuery()
  .withRanks()
  .withImages()
  .getByName(CharactersByID.SilverWolf)
  .then((resp) => {
    console.log(resp);
  });

// Response
{
  id: "1003",
  name: "Silver Wolf",
  rarity: 5,
  path: "Warlock",
  element: "Quantum",
  ranks: [
    "100601",
    "100602",
  ],
  icon: "https://vizualabstract.github.io/StarRailStaticAPI/assets/icon/character/1003.png",
  portrait: "https://vizualabstract.github.io/StarRailStaticAPI/assets/image/character_portrait/1003.png"
  _ranks: [
    {
      id: "100601",
      name: "Social Engineering",
      rank: 1,
      desc: "After using her Ultimate to attack enemies, Silver Wolf regenerates 7 Energy for every debuff that the target enemy currently has. This effect can be triggered up to 5 time(s) in each use of her Ultimate.",
      icon: "https://vizualabstract.github.io/StarRailStaticAPI/assets/icon/skill/1006_rank1.png"
    },
    {
      id: "100602",
      name: "Zombie Network",
      rank: 2,
      desc: "When an enemy enters battle, reduces their Effect RES by 20%.",
      materials: [
        {
          id: "11006",
          num: 1
        }
      ],
      icon: "https://vizualabstract.github.io/StarRailStaticAPI/assets/icon/skill/1006_rank2.png"
    }
  ]
}
```

## Languages

The Query Client offers a variety of options, but the most important one may be the language setting. By default, the Query builder will return english translations.

To understand how languages work with the StarRailStaticAPI, see [the Language section](https://vizualabstract.github.io/StarRailStaticAPI/#language).

To configure the query to use a different language translation, provide an options object to your query class:

```javascript
import { CharacterQuery, CharactersByID, Languages } from 'star-rail-api';

new CharacterQuery({
    language: Languages.chinese // or use 'cn'
  })
  .withRanks()
  .getByName(CharactersByID.SilverWolf)
  .then((resp) => {
    console.log(resp);
  });

// Response
{
  id: "1003",
  name: "银狼",
  rarity: 5,
  path: "Warlock",
  element: "Quantum",
  ranks: [
    "100601",
    "100602",
  ],
  icon: "icon/character/1003.png",
  portrait: "image/character_portrait/1003.png"
  _ranks: [
    {
      id: "100601",
      name: "社会工程",
      rank: 1,
      desc: "施放终结技攻击敌方目标后，目标每有1个负面效果，银狼恢复7点能量。该效果在每次终结技攻击中最多生效5次。"
    },
    {
      id: "100602",
      name: "僵尸网络",
      rank: 2,
      desc: "在敌方目标进入战斗时，使其效果抵抗降低20%。",
      materials: [
        {
          id: "11006",
          num: 1
        }
      ],
      icon: "icon/skill/1006_rank2.png"
    }
  ]
}
```

## CharactersByID, Characters

To make character retrieval easier, I've provided with two enumerated lists to aid in fetching characters by name or ID.

Keep in mind, `getByName` uses the English translation - so if you're using a different language, you'll want to create your own method for translating the keys.

**Characters enum**

```javascript
import { CharacterQuery, Characters } from 'star-rail-api';

// English with Characters enum
const weltEn = new CharacterQuery().getByName(Characters.Welt);

// Chinese
const weltCN = new CharacterQuery().getByName('瓦尔特');
```

While this is something I may support in the future, for now, I recommend using `getByID` and `CharactersByID` if you intend on support other languages. They are language agnostic:

**CharactersByID enum**

```javascript
import { CharacterQuery, CharactersByID } from 'star-rail-api';

const kafka = new CharacterQuery().getByID(CharactersByID.Kafka);
```

**Languages enum**

```javascript
import { CharacterQuery, Languages } from 'star-rail-api';

const japaneseClient = new CharacterQuery({ language: Languages.japanese });

const portugueseClient = new CharacterQuery({ language: 'pt' });
```

In addition to characters, I have an enumerated list for language translations, but you can always use the key found at [vizualabstract.github.io/StarRailStaticAPI#languag](https://vizualabstract.github.io/StarRailStaticAPI#languag).

## Local development

1. From the library folder, run `yarn link` to register package locally
2. From the project folder using library, run `yarn link 'star-rail-api`

When development is completes, perform the same actions with `unlink`:

1. From the library folder, run `yarn unlink` to register package locally
2. From the project folder using library, run `yarn unlink 'star-rail-api`

## Publishing a release

1. Create a new branch for all your changes
2. Update package.json with new version number
3. Submit a pull request to merge to main
4. Publish a new release with the new version number as a tag

## Links

- StarRailStaticAPI: [vizualabstract.github.io/StarRailStaticAPI](https://vizualabstract.github.io/StarRailStaticAPI)
- My other project, Relic Harmonizer: [https://relicharmonizer.com](https://relicharmonizer.com)
- StarRailRes: [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)
- Game data source: [Dimbreath/StarRailData](https://github.com/Dimbreath/StarRailData)
- HSR-Scanner [kel-z/HSR-Scanner](https://github.com/kel-z/HSR-Scanner)