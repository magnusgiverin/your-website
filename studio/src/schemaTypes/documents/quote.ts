import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Quote Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Who said this quote',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Geographic coordinates associated with the image',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      author: 'author',
    },
    prepare(selection) {
      return {
        title: selection.text,
        subtitle: selection.author ? `— ${selection.author}` : 'No author',
      }
    },
  },
})
