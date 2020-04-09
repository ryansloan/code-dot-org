# == Schema Information
#
# Table name: levels
#
#  id                    :integer          not null, primary key
#  game_id               :integer
#  name                  :string(255)      not null
#  created_at            :datetime
#  updated_at            :datetime
#  level_num             :string(255)
#  ideal_level_source_id :integer          unsigned
#  user_id               :integer
#  properties            :text(65535)
#  type                  :string(255)
#  md5                   :string(255)
#  published             :boolean          default(FALSE), not null
#  notes                 :text(65535)
#  audit_log             :text(65535)
#  parent_level_id       :integer
#
# Indexes
#
#  index_levels_on_game_id          (game_id)
#  index_levels_on_name             (name)
#  index_levels_on_parent_level_id  (parent_level_id)
#

class FrequencyAnalysis < Widget
  before_validation do
    self.href = 'frequency/frequency.html'
  end

  serialized_attrs :cipher, :texts

  def self.ciphers
    %w(default caesar substitution)
  end

  def self.create_from_level_builder(params, level_params)
    create!(level_params.merge(user: params[:user], game: Game.frequency_analysis, level_num: 'custom'))
  end
end
